import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./components/ui/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog"
interface IBook {
  id: string,
  title: string,
  author: string,
  category: string,
  price: number,
}
const API_URL = "https://6942211f686bc3ca8168b2b6.mockapi.io/api/book/book"
export default function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<IBook[]>([])
  const [id, setID] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [editingBook, setEditingBook] = useState<IBook | null>(null)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100); // giả lập
  const limit = 10;
  useEffect(() => {
    // 1. Fetch ALL để lấy total
    fetch(API_URL)
      .then(res => res.json())
      .then((all: IBook[]) => {
        setTotalPages(Math.ceil(all.length / limit));
      });

    // 2. Fetch theo page
    const url = new URL(API_URL);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    fetch(url.toString())
      .then(res => res.json())
      .then((data: IBook[]) => {
        setFormData(data);
      });
  }, [page]);



  function buildPages(current: number, total: number) {
    const pages: (number | "ellipsis")[] = [];
    const MAX_VISIBLE = 5;

    if (total <= MAX_VISIBLE) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(1, current - 2);
    let end = start + MAX_VISIBLE - 1;

    if (end > total) {
      end = total;
      start = end - MAX_VISIBLE + 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total) {
      pages.push("ellipsis", total);
    }

    return pages;
  }

  function handleOpenForm() {
    setIsOpen(true);
    resetForm()
  }
  function handleCloseForm() {
    setIsOpen(false);
    resetForm()
    setEditingBook(null)
  }
  function handleAddBook() {
    if (!title || !author || !category || !price) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        title,
        author,
        category,
        price: Number(price),
      }),
    })
      .then(res => res.json())
      .then((newBook: IBook) => {
        setFormData(prev => [...prev, newBook]);
        resetForm();
        setIsOpen(false);
      });
  }
  function openEditBook(item: IBook) {
    setIsOpen(true)
    setEditingBook(item)
    setID(item?.id)
    setTitle(item?.title)
    setAuthor(item?.author)
    setCategory(item?.category)
    setPrice(String(item?.price))
  }
  function handleEditBook() {
    if (!editingBook) return
    fetch(`${API_URL}/${editingBook.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title,
        author,
        category,
        price: Number(price),
      }),

    })
      .then(res => res.json())
      .then((updateBook: IBook) => {
        setFormData(prev => prev.map(book => book.id === updateBook.id ? updateBook : book));
        setEditingBook(null);
        setIsOpen(false);
        resetForm();
      })

  }

  function handleDeleteBook(item: IBook) {
    fetch(`${API_URL}/${item.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setFormData(prev => prev.filter(book => book.id !== item.id));
      });
  }
  function resetForm() {
    setID('')
    setTitle('')
    setAuthor('')
    setCategory('')
    setPrice('')
  }
  const pages = buildPages(page, totalPages);
  return (

    <div className="w-[1100px] h-[700px] mx-auto text-xl">
      <div>
        <button onClick={handleOpenForm} className="p-2 bg-blue-500 hover:bg-blue-700 rounded-xl text-white">Add Book</button>
      </div>
      <table className="w-[1100px]">
        <thead>
          <tr className="grid grid-cols-6 text-center bg-green-500 rounded-t-lg p-2">
            <td>ID</td>
            <td>Book Title</td>
            <td>Author</td>
            <td>Category</td>
            <td>Price</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {
            formData?.map((item) => (<tr className="grid grid-cols-6 text-center bg p-1">
              <td>{item?.id}</td>
              <td>{item?.title}</td>
              <td>{item?.author}</td>
              <td>{item?.category}</td>
              <td>{item?.price}</td>
              <td>
                <button type="button" onClick={() => openEditBook(item)} className="bg-yellow-300 hover:bg-yellow-500 px-3 rounded-lg mx-2">
                  Edit
                </button>
                <AlertDialog>
                  <AlertDialogTrigger className="bg-red-500 hover:bg-red-700 px-3 rounded-lg mx-2">Delete</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Bạn có chắc chắn xóa cuốn sách "{item.title}"</AlertDialogTitle>
                      <AlertDialogDescription>
                
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-400  rounded-lg hover:bg-gray-700 px-3">Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-500 hover:bg-red-700 px-3 rounded-lg" onClick={() => handleDeleteBook(item)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>))
          }

        </tbody>
      </table>
      {isOpen &&
        <form className="fixed inset-52 justify-center w-[520px] h-[300px] text-center border-2 rounded-t-lg mx-auto text-3xl bg-white">
          <h1 className="bg-gray-500 rounded-t-lg p-1 text-white">{editingBook ? "Update Book" : "Add new book"}</h1>
          <div className="p-2">
            <label className={editingBook ? "flex justify-between" : "hidden"}>ID: <input type="text" value={id} onChange={(e) => setID(e.target.value)} disabled={editingBook ? true : false} placeholder="Werewolf,..." className="focus:outline-none border-b bg-gray-400 text-gray-700 opacity-60"></input></label>

            <label className="flex justify-between">Bookname: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Werewolf,..." className="focus:outline-none border-b border-black "></input></label>
            <label className="flex justify-between">Author: <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tommy,..." className="focus:outline-none border-b border-black"></input></label>
            <label className="flex justify-between">Category: <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Animal,..." className="focus:outline-none border-b border-black"></input></label>
            <label className="flex justify-between">Price: <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="2000,..." className="focus:outline-none border-b border-black"></input></label>
          </div>
          <div className="flex w-[240px] mx-auto">
            <button type="button" className="bg-gray-400 w-28 mx-auto rounded-lg hover:bg-gray-700 text-white p-1" onClick={handleCloseForm}>Cancel</button>
            <button type="button" className="bg-cyan-500 w-28 mx-auto rounded-lg hover:bg-cyan-700 text-white p-1" onClick={editingBook ? handleEditBook : handleAddBook}>{editingBook ? "Update" : "Submit"}</button>
          </div>
        </form>
      }
      <Pagination>
        <PaginationContent>

          {/* PREV */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(p => Math.max(p - 1, 1))}
              aria-disabled={page === 1}
            />
          </PaginationItem>

          {/* PAGE NUMBERS */}
          {pages.map((p, index) =>
            p === "ellipsis" ? (
              <PaginationItem key={index}>
                <PaginationEllipsis onClick={() => setPage(totalPages)} />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={page === p}
                  onClick={() => setPage(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}


          {/* NEXT */}
          <PaginationItem>
            <PaginationNext
              aria-disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  )
}


