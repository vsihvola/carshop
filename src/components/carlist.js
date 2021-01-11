import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button'
import AddCar from './addcar'
import EditCar from './editcar'

export default function CarList(){
  const [cars, setCars] = useState([]);
  useEffect(() => fetchData(), []);
  const fetchData = () => {
    fetch('https://carstockrest.herokuapp.com/cars')
    .then(response => response.json())
    .then(response => setCars(response._embedded.cars))
    .catch(err => console.error(err))
  }

  const deleteCar = (link) => {
    if (window.confirm('Are you sure?')){
      fetch(link, {method: 'DELETE'})
      .then(response => fetchData())
      .catch(err => console.error(err))
    }
  }

  const saveCar = (car) => {
    fetch('https://carstockrest.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(car)
    })
    .then(res => fetchData())
    .catch(err => console.error(err))
  }

  const updateCar = (car, link) => {
    fetch(link, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(car)
    })
    .then(res => fetchData())
    .catch(err => console.error(err))
  }

  const columns = [
    {
      Header: 'Brand',
      accessor: 'brand'
    },
    {
      Header: 'Model',
      accessor: 'model'
    },
    {
      Header: 'Color',
      accessor: 'color'
    },
    {
      Header: 'Fuel',
      accessor: 'fuel'
    },
    {
      Header: 'Year',
      accessor: 'year'
    },
    {
      Header: 'Price',
      accessor: 'price'
    },
    {
      sortable: false,
      filterable: false,
      accessor: '_links.self.href',
      Cell: row => <EditCar updateCar={updateCar} car={row.original}/>
    },
    {
      sortable: false,
      filterable: false,
      accessor: '_links.self.href',
      Cell: ({value}) => <Button size='small' color='secondary' onClick={() => deleteCar(value)}>Delete</Button>
    }
  ]


  return (
    <div>
      <AddCar saveCar={saveCar} />
      <ReactTable defaultPageSize={10} filterable={true} data={cars} columns={columns} />
    </div>
  );

}
