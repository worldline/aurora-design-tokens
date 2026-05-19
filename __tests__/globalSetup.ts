import { execSync } from 'child_process'

export const setup = () => {
  execSync('npm run build')
}
