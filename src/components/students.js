import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

import { Button, Container, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import { StudentModel } from '../models/student';
import { logoutUser } from '../services/auth';
import { createData, deleteData, fetchData, updateData, uploadImage } from '../services/student';

class Students extends React.Component {

  state = { 
    info: [],
    form: new StudentModel(),
    modalInsert: false,
    modalEdit: false,
    modalDelete: false,
    modalUploadImage: false,
    studentToDelete: null,
    studentToUploadImage: null,
    imageFile: null,
    imagePreviewUrl: null
  }
  
  componentDidMount(){
    this.loadData();
  }

  loadData = async () => {
    try {
      const data = await fetchData();
      this.setState({ info: data });
    } catch (error) {
      console.error('Error loading data:', error);
    }  
  }

  handleChange=e=>{
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
  }

  handleFileChange = e => {
    const file = e.target.files[0];
    this.setState({ imageFile: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ imagePreviewUrl: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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

  openModalDelete = (student) => {
    this.setState({ modalDelete: true, studentToDelete: student });
  }

  closeModalDelete = () => {
    this.setState({ modalDelete: false, studentToDelete: null });
  }

  openModalUploadImage = (student) => {
    this.setState({ 
      modalUploadImage: true, 
      studentToUploadImage: student, 
      imagePreviewUrl: student.uri_img || null 
    });
  }

  closeModalUploadImage = () => {
    this.setState({ modalUploadImage: false, imageFile: null, studentToUploadImage: null, imagePreviewUrl: null });
  }

  uploadImage = async () => {
    if (!this.state.imageFile) return;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1]; 
        const imageUrl = await uploadImage(this.state.studentToUploadImage.id, base64Image);
        const updatedStudent = await updateData(this.state.studentToUploadImage.id, { ...this.state.studentToUploadImage, imageUrl });
        this.setState(prevState => ({
          info: prevState.info.map(student => student.id === updatedStudent.id ? updatedStudent : student),
          modalUploadImage: false,
          imageFile: null,
          studentToUploadImage: null,
          imagePreviewUrl: null
        }));
        this.loadData();
      };
      reader.readAsDataURL(this.state.imageFile);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  insert = async () => {
    try {
      const newStudent = await createData(this.state.form);
      this.setState(prevState => ({
        info: [...prevState.info, newStudent],
        modalInsert: false
      }));
    } catch (error) {
      console.error('Error creating data:', error);
    }
  }

  edit = async () => {
    try {
      const updatedStudent = await updateData(this.state.form.id, this.state.form);
      this.setState(prevState => ({
        info: prevState.info.map(student => student.id === updatedStudent.id ? updatedStudent : student),
        modalEdit: false
      }));
      this.loadData();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  delete = async () => {
    try {
      await deleteData(this.state.studentToDelete.id);
      this.setState(prevState => ({
        info: prevState.info.filter(student => student.id !== this.state.studentToDelete.id),
        modalDelete: false,
        studentToDelete: null
      }));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  handleLogout = () => {
    logoutUser();
    this.props.onLogout();
  }

  render(){
    return(
      <>
      <Container>
      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <h2>Gestión de Estudiantes</h2>
          <Button color="danger" onClick={this.handleLogout}>Cerrar Sesión</Button>
        </div>
        <Button color="success" onClick={()=>this.viewModalInsert()}>Agregar Estudiante</Button>
        <br />
        <Table>
          <thead>
            <tr>
              <th>Nombres</th> 
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Año</th>
              <th>Grado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {
              this.state.info.map((elem) => (
                <tr key={elem.id}>
                  <td> {elem.nombres} </td>
                  <td> {elem.apellidoPaterno} </td>
                  <td> {elem.apellidoMaterno} </td>
                  <td> {elem.anio} </td>
                  <td> {elem.grado} </td>
                  <td> 
                    <Button color="warning" onClick={() => this.openModalUploadImage(elem)}> Subir imagen </Button>{" "}
                    <Button color="primary" onClick={() => this.viewModalEdit(elem)}> Editar </Button>{" "}
                    <Button color="danger" onClick={() => this.openModalDelete(elem)}> Eliminar </Button>
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
            <h3>Agregar Estudiante</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Nombres: </label>
            <input className="form-control" name="nombres" type='text' onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <label>Apellido Paterno: </label>
            <input className="form-control" name="apellidoPaterno" type='text' onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <label>Apellido Materno: </label>
            <input className="form-control" name="apellidoMaterno" type='text' onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <label>Año: </label>
            <input className="form-control" name="anio" type='number' onChange={this.handleChange}/>
          </FormGroup>
          <FormGroup>
            <label>Grado: </label>
            <input className="form-control" name="grado" type='text' onChange={this.handleChange}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={()=>this.insert()}> Agregar </Button>
            <Button color="danger" onClick={()=>this.closeModalInsert()} > Cancelar </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.modalEdit}>
        <ModalHeader>
          <div>
            <h3>Editar Estudiante </h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label>Nombres: </label>
            <input className="form-control" name="nombres" type='text' onChange={this.handleChange} value={this.state.form.nombres}/>
          </FormGroup>
          <FormGroup>
            <label>Apellido Paterno: </label>
            <input className="form-control" name="apellidoPaterno" type='text' onChange={this.handleChange} value={this.state.form.apellidoPaterno}/>
          </FormGroup>
          <FormGroup>
            <label>Apellido Materno: </label>
            <input className="form-control" name="apellidoMaterno" type='text' onChange={this.handleChange} value={this.state.form.apellidoMaterno}/>
          </FormGroup>
          <FormGroup>
            <label>Año: </label>
            <input className="form-control" name="anio" type='number' onChange={this.handleChange} value={this.state.form.anio}/>
          </FormGroup>
          <FormGroup>
            <label>Grado: </label>
            <input className="form-control" name="grado" type='text' onChange={this.handleChange} value={this.state.form.grado}/>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={()=>this.edit(this.state.form) }> Editar </Button>
            <Button color="danger" onClick={()=>this.closeModalEdit()} > Cancelar </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.modalDelete}>
          <ModalHeader>
            Confirmar Eliminación
          </ModalHeader>
          <ModalBody>
            ¿Realmente quieres eliminar el registro {this.state.studentToDelete?.id}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.delete}>Eliminar</Button>
            <Button color="secondary" onClick={this.closeModalDelete}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalUploadImage}>
          <ModalHeader>
            <div>
              <h3>Subir Imagen</h3>
            </div>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <label>Seleccionar Imagen </label>
              <input className="form-control" type='file' accept="image/*" onChange={this.handleFileChange} />
            </FormGroup>
            {this.state.imagePreviewUrl && (
              <img src={this.state.imagePreviewUrl} alt="Previsualización" style={{ width: '100%' }} />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.uploadImage}>Subir</Button>
            <Button color="danger" onClick={this.closeModalUploadImage}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
}

export default Students;
