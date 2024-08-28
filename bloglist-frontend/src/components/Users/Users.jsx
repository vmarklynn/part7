import userService from '../../services/users'
import { useEffect, useState } from 'react'

const Users = () => {
  const [users, setUsers] = useState(null)

  useEffect(() => {
    userService
      .getAll()
      .then((users) => {
        setUsers(users)
      })
      .catch((error) => console.log(error))
  }, [])

  if (!users) return null

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Blogs Added</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <th>{user.name}</th>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
