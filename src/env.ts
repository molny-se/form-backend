import dotenvExtended from 'dotenv-extended'
import dotenvParseVariables from 'dotenv-parse-variables'
 
export let env: any = dotenvExtended.load({
  includeProcessEnv: true
});
env = dotenvParseVariables(env);
