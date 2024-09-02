import { Link } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'

const Users = ({ users }) => {
  if (!users) return null

  return (
    <TableContainer component={Paper}>
      <h1>Users</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Posts</TableCell>
            <TableCell>Blogs Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Users
