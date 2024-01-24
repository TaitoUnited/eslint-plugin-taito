import { ESLintUtils } from '@typescript-eslint/utils';
import { TSESTree } from '@typescript-eslint/typescript-estree';

const createRule = ESLintUtils.RuleCreator(() => 'https://google.com');

const rule = createRule<
  [{ authorizeCallRegexes: string[]; ignoreServicesRegexes: string[] }],
  'unauthorizedServiceMethod'
>({
  name: 'authorize-service-calls',
  defaultOptions: [
    {
      authorizeCallRegexes: ['authorize.*?'],
      ignoreServicesRegexes: ['AuthService'],
    },
  ],
  meta: {
    schema: [
      {
        type: 'object',
        properties: {
          authorizeCallRegexes: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
    docs: {
      // TODO: write the rule summary.
      description: 'All non-private service methods must be authorized',
      recommended: 'recommended',
    },
    type: 'problem',
    messages: {
      unauthorizedServiceMethod:
        'All non-private service methods must call authService.authorize()',
    },
  },
  create(ctx, options) {
    return {
      MethodDefinition(node) {
        if (
          !node.loc ||
          node.accessibility === 'private' ||
          (node.key.type === 'Identifier' && node.key.name === 'constructor')
        ) {
          return;
        }

        const parents = ctx.sourceCode.getAncestors?.(node).reverse() ?? [];

        const classDeclaration = parents.find(
          (p) => p.type === 'ClassDeclaration'
        ) as TSESTree.ClassDeclaration | undefined;

        // dont test on nonService or ignored classes
        if (
          classDeclaration?.id?.name?.endsWith('Service') === false ||
          options[0].ignoreServicesRegexes.some((r) =>
            classDeclaration?.id?.name.match(r)
          )
        ) {
          return;
        }

        const tokens = ctx.sourceCode.getTokens(node, {
          includeComments: false,
        }) as TSESTree.Token[];

        const nodes = tokens.map((token) =>
          ctx.sourceCode.getNodeByRangeIndex(token.range[0])
        );

        const functionCalls = nodes.filter(
          (n) => n?.type === 'CallExpression'
        ) as TSESTree.CallExpression[];

        const authCallees = functionCalls
          .map((call) => call.callee)
          .filter((c) => {
            if (
              c.type !== 'MemberExpression' ||
              c.property.type !== 'Identifier'
            ) {
              return;
            }

            const property = c.property;
            return options[0].authorizeCallRegexes.some((r) =>
              property.name.match(r)
            );
          }) as TSESTree.MemberExpression[];

        if (authCallees.length > 0) {
          return;
        }

        ctx.report({
          node,
          messageId: 'unauthorizedServiceMethod',
        });
      },
    };
  },
});

export default rule;
