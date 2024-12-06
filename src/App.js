import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';

const data = [
  { id: 1, character: "Naruto", anime: "Naruto"},
  { id: 2, character: "Yugi", anime: "Yugi Oh!"},
  { id: 3, character: "Shadow", anime: "Shadow Garden"},
  { id: 4, character: "Monkey D' Luffy", anime: "One Piece"}
]

class App extends React.Component {

  state = { 
    info: data,
    form: {
      id: '',
      character: '',
      anime: ''
    },
    modalInsert: false,
    modalEdit: false
  }

  handleChange=e=>{
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
  }

  viewModalInsert=()=>{
    this.setState({modalInsert: true});
  }

  closeModalInsert=()=>{
    this.setState({modalInsert: false});
  }

  viewModalEdit=(register)=>{
    this.setState({modalEdit: true, form: register});
  }

  closeModalEdit=()=>{
    this.setState({modalEdit: false});
  }

  insert=()=>{
    var valueNew = {...this.state.form};
    valueNew.id = this.state.info.length+1;
    var list = this.state.info;
    list.push(valueNew);
    this.setState({data: list, modalInsert: false});
  }

  edit=(dato)=>{
    var counter=0;
    var list=this.state.info;
    list.map((register)=>{
      if(dato.id == register.id){
        list[counter].character=dato.character;
        list[counter].anime=dato.anime;
      }
    });
    this.setState({data: list, modalEdit: false});
  }

  delete=(dato)=>{
    var option = window.confirm("Realmente quieres eliminar el registro" + " " +  dato.id);
    if(option){
      var counter = 0;
      var list = this.state.info;
      list.map((registro)=>{
        if(registro.id == dato.id){
          list.splice(counter, 1)
        }
        counter++;
      });
      this.setState({data: list});
    }
  }

  render(){
    return(
      <>
      <Container>
        <br />
        <Button color="success" onClick={()=>this.viewModalInsert()}>Agregar Character</Button>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Character</th>
              <th>Anime</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {
              this.state.info.map((elem) =>(
                <tr>
                  <td> {elem.id} </td>
                  <td> {elem.character} </td>
                  <td> {elem.anime} </td>
                  <td> 
                    <Button color="primary" onClick={()=>this.viewModalEdit(elem)}> Editar </Button>{" "}
                    <Button color="danger" onClick={()=>this.delete(elem)}> Eliminar </Button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </Container>

      <Modal isOpen={this.state.modalInsert}>
        <ModalHeader>
          <div>
            <h3>Insert Register</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Id: </label>
            <input className="form-control" readOnly type='text' value={this.state.info.length+1}/>
          </FormGroup>
          <FormGroup>
            <label>Character: </label>
            <input className="form-control" name="character" type='text' onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <label>Anime: </label>
            <input className="form-control" name="anime" type='text' onChange={this.handleChange}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={()=>this.insert()}> Insert </Button>
            <Button color="danger" onClick={()=>this.closeModalInsert()} > Cancel </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.modalEdit}>
        <ModalHeader>
          <div>
            <h3>Edit Register</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Id: </label>
            <input className="form-control" readOnly type='text' value={this.state.form.id}/>
          </FormGroup>
          <FormGroup>
            <label>Character: </label>
            <input className="form-control" name="character" type='text' onChange={this.handleChange} value={this.state.form.character}/>
          </FormGroup>
          <FormGroup>
            <label>Anime: </label>
            <input className="form-control" name="anime" type='text' onChange={this.handleChange} value={this.state.form.anime}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={()=>this.edit(this.state.form) }> Edit </Button>
            <Button color="danger" onClick={()=>this.closeModalEdit()} > Cancelar </Button>
        </ModalFooter>
      </Modal>
      </>
    )
  }
}

export default App;
