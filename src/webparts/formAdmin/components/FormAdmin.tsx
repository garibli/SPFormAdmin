import * as React from 'react'
import { IFormAdminProps } from './IFormAdminProps'
import { SPHttpClient } from '@microsoft/sp-http'
import styles from './FormAdmin.module.scss'

interface IListItem {
  Title: string
  AuthorName: string
  AuthorEmail: string
  typeMessage: string
}

const FormAdmin: React.FunctionComponent<IFormAdminProps> = (props) => {
  const [items, setItems] = React.useState<IListItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [filterType, setFilterType] = React.useState('')

  React.useEffect(() => {
    const fetchUserGroup = async () => {
      try {
        const userGroupsResponse = await props.spHttpClient.get(
          `${props.siteUrl}/_api/web/currentuser/?$expand=Groups`,
          SPHttpClient.configurations.v1
        )
        const userGroupsData = await userGroupsResponse.json()
        const userGroups = userGroupsData.Groups.map(
          (group: any) => group.Title
        )

        let listUrl = ''
        if (userGroups.includes('Group A')) {
          listUrl = `${props.siteUrl}/_api/web/lists/getbytitle('complaintsA')/items?$select=Title,AuthorName,AuthorEmail,typeMessage`
        } else if (userGroups.includes('Group B')) {
          listUrl = `${props.siteUrl}/_api/web/lists/getbytitle('complaintsB')/items?$select=Title,AuthorName,AuthorEmail,typeMessage`
        } else if (userGroups.includes('Group C')) {
          listUrl = `${props.siteUrl}/_api/web/lists/getbytitle('complaintsC')/items?$select=Title,AuthorName,AuthorEmail,typeMessage`
        } else {
          console.error('User is not part of Group A, B, or C')
          return
        }

        const listResponse = await props.spHttpClient.get(
          listUrl,
          SPHttpClient.configurations.v1
        )
        const listData = await listResponse.json()
        setItems(listData.value)
      } catch (error) {
        console.error('Error fetching user group or list data', error)
      }
    }

    fetchUserGroup()
  }, [props.spHttpClient, props.siteUrl])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase())
  }

  const handleFilterChange = (type: string) => {
    setFilterType(type)
  }

  const filteredItems = items
    .filter((item) => item.Title.toLowerCase().includes(searchTerm))
    .filter((item) => filterType === '' || item.typeMessage === filterType)

  return (
    <div className={styles.formAdmin}>
      <div className={styles.header}>
        <h2>Geri Bildirişlər</h2>
        <div className={styles.filterDropdown}>
          <button className={styles.dropdownButton}>▼</button>
          <div className={styles.dropdownContent}>
            <label>
              <input
                type="radio"
                name="filterType"
                value="Şikayət"
                checked={filterType === 'Şikayət'}
                onChange={() => handleFilterChange('Şikayət')}
              />
              Şikayət
            </label>
            <label>
              <input
                type="radio"
                name="filterType"
                value="Təklif"
                checked={filterType === 'Təklif'}
                onChange={() => handleFilterChange('Təklif')}
              />
              Təklif
            </label>
            <label>
              <input
                type="radio"
                name="filterType"
                value=""
                checked={filterType === ''}
                onChange={() => handleFilterChange('')}
              />
              Hamısı
            </label>
          </div>
        </div>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="axtarış edin..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mesaj</th>
            <th>Müəllif</th>
            <th>Poçt Ünvanı</th>
            <th>Şikayət/Təklif</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item.Title}</td>
              <td>{item.AuthorName}</td>
              <td>{item.AuthorEmail}</td>
              <td>{item.typeMessage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FormAdmin
