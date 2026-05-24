#!/usr/bin/env node
import bcrypt from 'bcrypt'
import { createInterface } from 'readline'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ENV_PATH = join(__dirname, '../.env')

const rl = createInterface({ input: process.stdin, output: process.stdout })
const q = (prompt) => new Promise(resolve => rl.question(prompt, resolve))

async function main() {
  console.log('\n=== Best Practice AI — Создание администратора ===\n')
  const password = await q('Введите пароль администратора: ')
  if (password.length < 8) {
    console.error('Пароль должен быть не менее 8 символов')
    process.exit(1)
  }
  const hash = await bcrypt.hash(password, 12)

  let env = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf-8') : readFileSync(join(__dirname, '../.env.example'), 'utf-8')

  if (env.includes('ADMIN_PASSWORD_HASH=')) {
    env = env.replace(/ADMIN_PASSWORD_HASH=.*/, `ADMIN_PASSWORD_HASH=${hash}`)
  } else {
    env += `\nADMIN_PASSWORD_HASH=${hash}\n`
  }

  writeFileSync(ENV_PATH, env)
  console.log('\nПароль установлен! Запустите сервер командой: npm run dev\n')
  rl.close()
}

main().catch(console.error)
