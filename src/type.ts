export interface BuddyOptions {
  /**
   * Personal Access Token.
   * @see https://buddy.works/docs/api/getting-started/oauth2/personal-access-token
   */
  token: string

  workspace: string

  /**
   * https://buddy.works/docs/api/getting-started/overview#endpoint
   *
   * default to be 'https://api.buddy.works'
   */
  baseUrl?: string
}

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

interface BaseEnvVar {
  key: string
  value: string
  type?: 'VAR' | 'SSH_KEY'
  description?: string
  settable?: boolean
  encrypted?: boolean
  file_place?: string
  file_path?: string
  file_chmod?: string
}

export interface CreateEnvVarArgs extends BaseEnvVar {
  project?: {
    name: string
  }
  pipeline?: {
    id: string
  }
  action?: {
    id: string
  }
}

export interface EnvVarReturn extends BaseEnvVar {
  url: string
  id: string
  public_value?: string
  key_fingerprint?: string
  checksum?: string
}

export interface EditEnvVarArgs extends Omit<Partial<BaseEnvVar>, 'key'> {
  ssh_key?: boolean
}
