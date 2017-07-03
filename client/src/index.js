import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import './index.css';

const App = () => (
  <Router>
    <div>
      <Route exact path="/" 
      component={(props) =>
       (<SearchBox 
       	location={props.location} 
       	match={props.match}/>)}
       />

      <Route exact path="/items" 
      component={(props) => 
      	(<SearchResults 
      		location={props.location}
      		history={props.history} />)} 
      	/>
      <Route exact path="/items/:id" 
      component={(props)=>
      	(<ItemDetails location={props.location} 
       	match={props.match}/>)}/>
    </div>
  </Router>
)

const ItemDetailsDescription = (props) => (
	<div className="item-details-description">
		<p>Descripción del producto</p>
		<div dangerouslySetInnerHTML={{__html: props.description}}></div>
	</div>
)

const ItemDetailsPrice = (props) => (
	<div className="item-details-price-container">
		<div>
			<span className="item-details-condition">{props.item.condition}</span>
			<span > - </span>
			<span className="item-details-condition">{props.item.sold_quantity} vendidos</span>
		</div>
		<span className="item-details-title">{props.item.title}</span>
		<span className="item-details-price">$ {numberFormat(props.item.price.amount)}</span>
		<div className="item-details-buy">Comprar</div>

	</div>
)

class ItemDetails extends React.Component {

	constructor() {
		super();
		this.state = {
			item:undefined
		}
	}
	componentDidMount() {
		const self = this;
		let query = 'http://localhost:3001/api/items/' + this.props.match.params.id;

	    fetch(query) 
            .then(function(response) {
            	return response.json();
            }).then(function(results) {
        		self.setState({
        			item: results
        		})
		  });

	}
	render() {
		return(
			<div>
			{this.state.item !== undefined && 
			<div className="item-details-container">
				<SearchBox location={this.props.location}/>
				<div className="item-details-upper">
					<img src={this.state.item.item.picture}
					className="item-details-picture"
					alt=""/>
					<ItemDetailsPrice item={this.state.item.item}/>
				</div>
				<ItemDetailsDescription description={this.state.item.description}/>
			</div>
			}
			</div>
			)
	}
}


const CategoryItem = (props) => (
	props.isLast ?
		<li> <span className="active">{props.category} </span></li> :
  		<li> <span>{props.category} </span></li> 
)

class CategoryList extends React.Component {
	render() {
		const categories = this.props.categories;
		let list = [];

		categories.forEach((result,index) => 
		  list.push(<CategoryItem category={result} 
		  	isLast={index === (categories.length - 1)}  
		  	key={result}/>)
		  );
		return (<ul className="breadcrumb"> {list} </ul>)
	}
}

const ItemListInfo = (props)=> (
	<div className="item-info-container">
		<div className="item-info-price">
			<span> $ {numberFormat(props.item.price.amount)} </span>

			{props.item.free_shipping > 0 &&
		        <div className="free-sheeping-image" />
	        }
        </div>
    	<span > {props.item.title} </span>
	</div>
)

class ItemList extends React.Component {
	render() {
		return (
			<li className="item-list-container">
				<div className="item-list" onClick={(i)=>this.props.handlerOnClick(i,this.props.item.id)}>
					<img src={this.props.item.picture} 
					className="item-list-image"
					alt=""/>
					<ItemListInfo item={this.props.item} />
					<div className="place"> {this.props.item.place} </div>
				</div>
			</li>
			)
	}
}

class SearchResults extends React.Component {
	constructor() {
		super();
		this.state = {
			results:undefined
		}
	}
	componentDidMount() {
		const self = this;
		let query = this.props.location.search.split('=')[1];
		query = 'http://localhost:3001/api/items?q=' + query;

	    fetch(query) 
            .then(function(response) {
            	return response.json();
            }).then(function(results) {
        		self.setState({
        			results: results
        		})
		  });

	}

	handlerOnClick(i,id) {
		this.props.history.push("/items/"+id);
	}

	render() {
		return (
			<div className="search-results-container">
				<SearchBox location={this.props.location}/>
				{this.state.results !== undefined &&
					<CategoryList categories={this.state.results.categories}/>
				}
				{this.state.results !== undefined &&
					<SearchResultsList handlerOnClick={(i,id)=>this.handlerOnClick(i,id)} items={this.state.results.items}/>
				}

			</div>)
	}
}

class SearchResultsList extends React.Component {
	render() {
		let list = [];
		const items = this.props.items;
		items.forEach((item)=> 
			list.push(<ItemList item={item}
			 handlerOnClick={(i,id)=>this.props.handlerOnClick(i,id)} 
			 key={item.id}/>));

		return (<ul className="list-item-container">
			{list}
			</ul>)
	}
}


class SearchBox extends React.Component {

	componentDidMount() {
		let searchText = this.props.location.search.split('=')[1];
		if(searchText)
			this.setState({searchText:searchText})
	}
	constructor() {
		super();
		this.state = {
			searchText: ''
		}
	}

	handlerOnChange(e) {
		this.setState({searchText:e.target.value})
	}

	render() {

		return (
		<div className="search-bar-container"> 
			<form action="/items" className="search-form"> 
				<div className="ml-logo"/>
				<input 
					className="search-input" 
					placeholder="Nunca dejes de buscar"
					name="q"
					onChange={(e)=>this.handlerOnChange(e)}
					value={this.state.searchText}
					type="text"/>
				<button 
					type="submit" 
					className="search-btn">
				</button>
			</form>
		</div>)
	}
}

function numberFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


ReactDOM.render(
  <App/>,
  document.getElementById('root')
);