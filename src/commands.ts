import { Answers } from './cmds/answers'
import { Correct } from './cmds/correct'
import { Imagine } from './cmds/imagine'
import { Translate } from './cmds/translate'
import { Command } from './types/command'

export const Commands: Command[] = [
  Answers,
  Correct,
  Imagine,
  Translate,
]
