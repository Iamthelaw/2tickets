import React, { Component } from 'react'
import './App.css'

class App extends Component {
  constructor() {
    super()

    this.selectSeat = this.selectSeat.bind(this)
    this.getEvent = this.getEvent.bind(this)
    this.removeFromBasket = this.removeFromBasket.bind(this)
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.state = {
      modal: false,
      currentEvent: 0,
      events: [{
        id: 0,
        name: 'Nutcracker'
      },
      {
        id: 1,
        name: 'Ruslan & Ludmila'
      }],
      tickets: [
        {event: 0, id: 0, reserved: true, price: 800},
        {event: 0, id: 1, reserved: false, price: 800},
        {event: 0, id: 2, reserved: false, price: 900},
        {event: 0, id: 3, reserved: false, price: 900},
        {event: 1, id: 4, reserved: false, price: 900},
        {event: 1, id: 5, reserved: false, price: 900},
        {event: 1, id: 6, reserved: true, price: 800},
        {event: 1, id: 7, reserved: false, price: 800}
      ],
      cart: []
    }
  }
  closeModal() {
    this.setState({modal: false})
  }
  showModal(eventId) {
    this.setState({modal: true, currentEvent: eventId})
  }
  addToBasket(item) {
    this.setState({cart: this.state.cart.concat([item])})
  }
  removeFromBasket(item) {
    this.setState({cart: this.state.cart.filter(x => x !== item)})
  }
  selectSeat(item) {
    this.state.cart.indexOf(item) === -1 ? this.addToBasket(item) : this.removeFromBasket(item)
  }
  getEvent(eventId) {
    return this.state.events.filter(item => item.id === eventId)[0]
  }
  render () {
    return (
      <Store>
        {
          this.state.modal
        ? <Modal>
            <Button type='close' action={this.closeModal} />
            <h1>Choose a place</h1>
            <Tickets
              event={this.state.currentEvent} tickets={this.state.tickets}
              select={this.selectSeat} />
            <Info cart={this.state.cart} />
          </Modal>
        : <Page>
            <h1>List of Events</h1>
            <EventList items={this.state.events} modal={this.showModal} />
            <Cart
              items={this.state.cart} event={this.getEvent}
              delete={this.removeFromBasket} />
          </Page>
        }
      </Store>
    )
  }
}

const Store = props => <div className='App'>{props.children}</div>

const Button = props => <a className={props.type} onClick={props.action}>x</a>

const Modal = props => <div className='modal'>{props.children}</div>

const Page = props => {
  return <div className='page'>{props.children}</div>
}

const EventList = props => {
  const events = props.items.map(item => {
    return <li key={item.id} onClick={() => props.modal(item.id)}>{item.name}</li>
  })
  return <ul className='events'>{events}</ul>
}

const Info = props => {
  let inStock = props.cart.length
  let total = inStock ? props.cart.map(item => item.price).reduce((prev, curr) => prev + curr) : 0
  return <div>{inStock > 0 && `In cart: ${inStock}, Total: ${total} .-`}</div>
}

const Cart = props => {
  let inStock = props.items.length
  let total = inStock ? props.items.map(item => item.price).reduce((prev, curr) => prev + curr) : 0
  let lines = props.items.map(item => {
    let event = props.event(item.event)
    return (<CartLine key={item.id} event={event} seat={item} delete={props.delete} />)
  })
  return (
    <div className='cart'>
      <hr />
      {inStock > 0
      ? <div><ul>{lines}</ul><p>Total: {total} .-</p></div>
      : <p>Cart is empty</p>}
    </div>)
}

const CartLine = props => {
  return (
    <li>
      <span>Ticket for {props.event.name}, seat №{props.seat.id}, price - {props.seat.price}</span>
      <Button type='close' action={() => props.delete(props.seat)} />
    </li>)
}

const Tickets = props => {
  const tickets = props.tickets
    .filter(item => item.event === props.event)
    .map(item => {
      return (<div
        className={item.reserved ? 'reserved' : 'seat'}
        key={item.id} onClick={() => props.select(item)}></div>)
    })
  return <div className='tickets'>{tickets}</div>
}

export default App
