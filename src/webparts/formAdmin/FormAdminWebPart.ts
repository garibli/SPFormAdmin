import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane'
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import FormAdmin from './components/FormAdmin'
import { IFormAdminProps } from './components/IFormAdminProps'

export interface IFormAdminWebPartProps {
  description: string
}

export default class FormAdminWebPart extends BaseClientSideWebPart<IFormAdminWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IFormAdminProps> = React.createElement(
      FormAdmin,
      {
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        spHttpClient: this.context.spHttpClient,
      }
    )

    ReactDom.render(element, this.domElement)
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement)
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'FormAdmin WebPart Configuration',
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description',
                }),
              ],
            },
          ],
        },
      ],
    }
  }
}
