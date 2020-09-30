const form = document.querySelector("form");
const container = document.querySelector(".container");
const bookList = document.querySelector(".book-list");


class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBook(book){
        const bookEntry = document.createElement("tr");
        bookEntry.innerHTML = `<td>${book.title}</td>
                               <td>${book.author}</td>
                               <td>${book.isbn}</td>
                               <td><a href= "#" class = "remove">Remove Book</a></td>`;
        bookList.appendChild(bookEntry);
    }
    clearForm(){
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
    removeBook(target){
        if(target.className.includes("remove")){
            target.parentElement.parentElement.remove();
        }
    }
    showAlert(message, eventType){
        const alert = document.createElement("div");
        alert.innerText = message;
        alert.className = `alert ${eventType}`;
        container.insertBefore(alert, form);
        setTimeout(function(){
            document.querySelector(".alert").remove();
        }, 3000);
    }
}

class Storage{
    static getBooks(){
        let books;
        if(localStorage.getItem("books") === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }

    static storeBook(book){
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static displayBooks(){
        const books = Storage.getBooks();
        books.forEach(book => {
            const ui = new UI();
            ui.addBook(book);
        });
    }

    static removeBook(isbn){
        const books = Storage.getBooks();
        books.forEach((book, index) => {
            if(isbn === book.isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

document.addEventListener("DOMContentLoaded", Storage.displayBooks);

form.addEventListener("submit", function(e){
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
    const ui = new UI();
    if(title === "" || author === "" || isbn === ""){
        ui.showAlert("Please fill up all the fields.", "error");
    }else{
        const book = new Book(title, author, isbn);
        ui.addBook(book);
        Storage.storeBook(book);
        ui.clearForm();
        ui.showAlert("Book added.", "success");
    }
    e.preventDefault();
});

bookList.addEventListener("click", function(e){
    const ui = new UI();
    ui.removeBook(e.target);
    ui.showAlert("Book removed.", "success");
    Storage.removeBook(e.target.parentElement.previousElementSibling.innerText);
    console.log(e.target.parentElement.previousElementSibling.innerText);
    e.preventDefault();
});
