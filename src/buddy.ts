/**
 * Buddy Api
 * @see https://buddy.works/docs/api/getting-started/overview
 */

import {
  BuddyOptions,
  CreateEnvVarArgs,
  EditEnvVarArgs,
  EnvVarReturn,
  HTTPMethod,
} from './type'

export class Buddy {
  static readonly #BASE_URL = 'https://api.buddy.works'
  #token: string
  #workspace: string
  #baseUrl: string
  #preUrl: string

  constructor(args: BuddyOptions) {
    this.#token = args.token
    this.#workspace = args.workspace
    this.#baseUrl = args.baseUrl ?? Buddy.#BASE_URL
    this.#preUrl = `${this.#baseUrl}/workspaces/${this.#workspace}/`
  }

  async #fetch<T>(subUrl: string, method: HTTPMethod, body?: object): Promise<T> {
    const headers = new Headers()
    headers.set('Authorization', `Bearer ${this.#token}`)
    let hasBody: boolean = false
    let url = this.#preUrl + subUrl
    if (body) {
      if (method !== HTTPMethod.GET) {
        headers.set('Content-Type', 'application/json')
        hasBody = true
      }
      else {
        const params = new URLSearchParams(body as Record<string, string>)
        url = `${url}?${params.toString()}`
      }
    }
    if (body && method !== HTTPMethod.GET) {
      headers.set('Content-Type', 'application/json')
    }
    headers.set('Accept', 'application/json')
    const response = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : null,
    })
    if (!response.ok) {
      console.log(await response.json())
      throw response.statusText
    }
    if (response.body == null) {
      return null as T
    }
    return response.json() as Promise<T>
  }

  /**
   * https://buddy.works/docs/api/general/environment-variables/create
   * @param envvar
   * @returns
   */
  async createEnvVar(args: CreateEnvVarArgs): Promise<EnvVarReturn> {
    return this.#fetch(`variables`, HTTPMethod.POST, args)
  }

  /**
   * https://buddy.works/docs/api/general/environment-variables/get
   * @param id
   */
  async getEnvVar(id: string): Promise<EnvVarReturn> {
    return this.#fetch(`variables/${id}`, HTTPMethod.GET)
  }

  /**
   * https://buddy.works/docs/api/general/environment-variables/list
   * @returns
   */
  async listEvnVars(args?: {
    projectName?: string
    pipelineId?: string
    actionId?: string
  }): Promise<Array<EnvVarReturn>> {
    return this.#fetch<{
      variables: Array<EnvVarReturn>
    }>(`variables`, HTTPMethod.GET, args).then(json => json.variables)
  }

  /**
   * https://buddy.works/docs/api/general/environment-variables/edit
   * @param id
   * @param args
   * @returns
   */
  async editEnvVar(id: string, args: EditEnvVarArgs): Promise<EnvVarReturn> {
    return this.#fetch(`variables/${id}`, HTTPMethod.PATCH, args)
  }

  /**
   * https://buddy.works/docs/api/general/environment-variables/delete
   * @param id
   * @returns
   */
  async deleteEnvVar(id: string): Promise<void> {
    return this.#fetch(`variables/${id}`, HTTPMethod.DELETE)
  }
}
