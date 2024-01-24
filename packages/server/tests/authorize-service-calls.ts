import { RuleTester } from '@typescript-eslint/rule-tester';
import rule from '../src/rules/authorize-service-calls';

const tester = new RuleTester();

tester.run('authorize-service-calls', rule as any, {
  valid: [
    {
      code: `
        class TestService {
          async test() {
            await this.authService.authorize('test', 'test2');

            asd();

            jne();
          }
        }
      `,
    },
    {
      code: `
    import AuthService from './auth.service';

    class TestService {
      constructor(private readonly authService: AuthService) {}

      async test() {
        await this.authService.authorize();

        return 1;
      }
    }`,
    },
    {
      code: `
    class TestService {
      private async test(asd: string) {
        doingStuff();

        return 1;
      }
    }`,
    },
    {
      code: `
        class AuthService {
          async authorize() {
            console.log('jaa');
          }
        }
      `,
    },
    {
      code: `
      class JokuLuokka {
        async test() {
          console.log('jaa');
        }
      }
    `,
    },
    {
      code: `
      import AuthService from './auth.service';

      class TestService {
        constructor(private readonly authService: AuthService) {}
  
        async test() {
          await this.authService.authorizePublic();
  
          return 1;
        }
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      class TestService {
        async unauthorizedMethod() {
          console.log('ei midii')
        }
      }
    `,
      errors: [
        'All non-private service methods must call authService.authorize()',
      ] as any,
    },
  ],
});
