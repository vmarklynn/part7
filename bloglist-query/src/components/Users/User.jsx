import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  Paper
} from '@mui/material'

const User = ({ user }) => {
  if (!user) return null

  return (
    <TableContainer component={Paper}>
      <h1>{user.name}</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Posts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {user.blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>{blog.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default User
