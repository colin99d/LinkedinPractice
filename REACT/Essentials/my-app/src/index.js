import React, {Component} from 'react'
import ReactDom from 'react-dom'

let bookList = [
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
  {"title":"The Sun also Rises", "author":"Ernst", "pages":260},
];

const Book = ({title, author, pages , freeBookmark}) => {
  return(
    <section>
      <h2>{title}</h2>
      <p>By: {author}</p>
      <p>Pages: {pages}</p>
      <p>Free Bookmark Today: {freeBookmark ? 'Yes!' : 'No!'}</p>
    </section>
  );
}

const Hiring = () => <div><p>The library is hiring. Go to www.library.com for more.</p></div>


const NotHiring = () => <div><p>The library is not hiring.</p></div>


class Library extends React.Component {

  static defaultProps = {
    books: [
      {"title":"The Sun also Rises", "author":"Ernst", "pages":260}
    ]
  }

  state = {
    open: false,
    freeBookmark: true,
    hiring: false,
    data: [],
    loading: false,
  };

  componentDidMount() {
    this.setState({loading:true})
    fetch('https://hplussport.com/api/products/order/price/sort/asc/qty/1')
      .then(data => data.json())
      .then(data => this.setState({data, loading:false}))
  }

  toggleOpenClosed = () => {
    this.setState({
      open: !this.state.open
    })
  };
  render() {
    const {books} = this.props
    return (
      <div>
        {this.state.hiring ? <Hiring /> : <NotHiring />}
        {this .state.loading
          ? "loading..."
          : <div>
              {this.state.data.map(product => {
                return(
                  <div key = {product.id}>
                    <h3>Library product of the week</h3>
                    <h4>{product.name}</h4>
                    <img alt={product.name} src={product.image} height={100} />
                  </div>
                )
              }

              )}
            </div>
        
        }
        <h1>The library is {this.state.open ? 'open' : 'closed'}</h1>
        <button onClick={this.toggleOpenClosed}>Change</button>
        {books.map( 
          (book, i) => 
            <Book 
              key = {i}
              title={book.title} 
              author={book.author} 
              pages={book.pages}
              freeBookmark={this.state.freeBookmark} />
          )}
      </div>
    );
  }
}


ReactDom.render(
  <Library books={bookList}/>, 
  document.getElementById('root'));
