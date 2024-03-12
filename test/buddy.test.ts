import {
  describe,
  expect,
  test,
} from '@jest/globals'
import { Buddy } from '../src/buddy'
import 'dotenv/config'

const api = new Buddy({
  token: process.env.TOKEN!,
  workspace: process.env.WORKSPACE!,
})

describe('project APIs', () => {
  test('add/modify/delete envvar', async () => {
    try {
      // add
      const v = await api.createEnvVar({
        key: 'testName',
        value: 'testValue',
        project: {
          name: process.env.PROJECT!,
        },
      })
      let nv = await api.getEnvVar(v.id)
      expect(v).toMatchObject(nv as unknown as Record<string, unknown>)
      let vars = await api.listEvnVars({
        projectName: process.env.PROJECT,
      })
      expect(vars).toHaveLength(1)
      expect(vars[0]).toMatchObject({
        key: 'testName',
        value: 'testValue',
      })

      // modify
      await api.editEnvVar(v.id, {
        value: 'testValue2',
      })
      nv = await api.getEnvVar(v.id)
      expect(nv.value).toBe('testValue2')

      // delete
      await api.deleteEnvVar(v.id)
      vars = await api.listEvnVars({
        projectName: process.env.PROJECT,
      })
      expect(vars).toHaveLength(0)
    }
    finally {
      const vars = await api.listEvnVars({
        projectName: process.env.PROJECT,
      })
      await Promise.all(vars.map(v => api.deleteEnvVar(v.id)))
    }
  }, 20000)
})
