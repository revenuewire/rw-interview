import React, { Component } from 'react';

class CarList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      curCar: -1,
      car: {},
      update: []
    };

    this.handleCarSave = this.handleCarSave.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleCarSave = e => {
    e.preventDefault();
    let url = '';
    this.props.webLinks.map(link => (
      url = parseInt(link.carId) === this.state.curCar && link.ok ? link.url : ''
      )
    )
    this.state.update && this.state.update.length !== 0 ? this.props.doUpdateCars(this.state.car, url) : this.props.doPostCars(this.state.car);
  };

  handleCarDelete = (carId, deleteLink) => {
    this.props.doDeleteCars(carId, deleteLink);
  };

  handleChange = e => {
    const car = {...this.state.car};
    car[e.target.name] = e.target.value;
    this.setState({car});
  }

  showModal = (id, update) => {
    this.setState({ show: true });
    //this.setState({ update: [...this.state.update, update] });
    this.setState({ update });
    this.setState({ curCar: id });
    this.props.getCar(id);
  }

  hideModal = () => {
    this.setState({ show: false });
  }

  componentDidMount() {
    this.props.getCarList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.car.res !== this.props.car.res) {
      const car = {...this.state.car};
      Object.keys(this.props.car.res).map(key => {
        car[key] = this.props.car.res[key];
        return null;
      });
      this.setState({car});
    } else if (prevProps.carList.deletedCarId !== this.props.carList.deletedCarId) {
      const car = {...this.state.car};
      Object.keys(this.props.car.res).map(key => {
        car[key] = this.props.car.res[key];
        return null;
      });
      this.setState({car});
    }
  }

  renderError(prop) {
    if (prop && prop.error && prop.error.status === 500) {
      return (
        <p className="error">Oops, something went wrong... Please, try again</p>
      );
    }
    return <span />;
  }

  render() {
    const { cars, loading, commiting, commited } = this.props.carList;
    const { carList } = this.props;

    return (
      <div>
        <Modal show={this.state.show} handleClose={this.hideModal}>
          {commiting && (<div className="sending">Sending...</div>)}
          {!commiting && !commited && (<form onSubmit={this.handleCarSave}>
            {Object.keys(this.props.car.res).map((key, i) => (
              <div key={key}>{key} {key !== 'id' ? <input
                name={key}
                type="text"
                value={this.state.car[key] || ''}
                onChange={this.handleChange}
              /> : this.state.car[key]}</div>
              ))}
            <br />
            <button>Save</button>
          </form>
          )}
          {!commiting && this.props.webLinks &&
            (this.props.webLinks.map(link => (
              parseInt(link.carId) === this.state.curCar && link.ok && <div key={link.carId}><a href={link.url} target="_blank" rel="noopener noreferrer">see me on the web</a></div>
              )
            ))
          }
        </Modal>
        {loading &&
          !commiting && (
            <div>Loading...</div>
          )}
        {!loading && this.renderError(carList)}
        {!loading && (
          <table>
            <tbody>
              {cars.map((car, i) => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.type}</td>
                  <td>
                    <button type='button' onClick={() => this.showModal(car.id, this.props.webLinks.filter(link => parseInt(link.carId) === car.id))}>Edit</button>
                    {this.props.webLinks &&
                      (this.props.webLinks.map(link => (
                        parseInt(link.carId) === car.id ? <span key={link.carId}><a href={link.url} target="_blank" rel="noopener noreferrer">View</a><button type='button' onClick={() => this.handleCarDelete(link.carId, link.url)}>Delete</button></span> : ''
                        )
                      ))
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';
  return (
    <div className={showHideClassName}>
      <section className='modal-main'>
        {children}
        <button
          onClick={handleClose}
        >
          Close
        </button>
      </section>
    </div>
  );
};

export default CarList;
