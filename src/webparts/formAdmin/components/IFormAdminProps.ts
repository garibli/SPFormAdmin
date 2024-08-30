import { SPHttpClient } from '@microsoft/sp-http'

export interface IFormAdminProps {
  description: string
  siteUrl: string
  spHttpClient: SPHttpClient
}
