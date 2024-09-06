import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react'
import { createBlog } from '../../reducers/blogReducer'
import { handleAlert } from '../../reducers/alertReducer'
import {
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TablePagination,
  Paper
} from '@mui/material'
import { Link } from 'react-router-dom'
import Togglable from '../Togglable/Togglable'
import BlogForm from '../BlogForm/BlogForm'

const Blogs = ({ blogs }) => {
  const ROWS_PER_PAGE = 10
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)

  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, ROWS_PER_PAGE))
    setPage(0)
  }

  const create = (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      dispatch(createBlog(blogObject))
      dispatch(
        handleAlert(
          `A new blog ${blogObject.title} by ${blogObject.author} was added.`,
          false
        )
      )
    } catch (e) {
      dispatch(handleAlert('Failed to post blog', true))
    }
  }

  if (!blogs) return null

  return (
    <TableContainer component={Paper}>
      <h1>Blogs</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Author</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBlogs
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((blog) => (
              <TableRow key={blog.id}>
                <TableCell scope="blog">
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Togglable buttonLabel="New Note" ref={blogFormRef}>
        <BlogForm create={create} />
      </Togglable>
      <TablePagination
        component="div"
        count={blogs.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}

export default Blogs
