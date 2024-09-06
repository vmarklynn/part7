import { useState, useRef } from 'react'
import { handleAlert } from '../../reducers/alertReducer'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import blogService from '../../services/blogs'
import Togglable from '../Togglable/Togglable'
import BlogForm from '../BlogForm/BlogForm'
import {
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Table,
  TableCell,
  Paper
} from '@mui/material'
import { Link } from 'react-router-dom'

const Blogs = ({ blogs }) => {
  const ROWS_PER_PAGE = 10
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE)
  const alert = handleAlert()

  const queryClient = useQueryClient()
  const blogFormRef = useRef()

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, ROWS_PER_PAGE))
    setPage(0)
  }

  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      alert({
        alert: `A new blog ${newBlog.title} by ${newBlog.author} was added.`,
        error: false
      })
    },
    onError: () => {
      alert({ alert: 'Blog failed to post', error: true })
    }
  })

  const create = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
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
