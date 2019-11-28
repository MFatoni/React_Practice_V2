import React, {Component} from "react";
import "semantic-ui-css/semantic.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from "moment";
import {
  Menu,
  Icon,
  Form,
  Button,
  Grid,
  Segment,
  Header,
  Input,
  Card,
  Image
} from "semantic-ui-react";

export default class MenuExampleMenus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      edit: false,
      dataPost: {
        id: 0,
        nama: "",
        jabatan: "",
        gender: "",
        tanggal: ""
      }
    };
    this.handleRemove = this.handleRemove.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }
  handleRemove(e) {
    console.log(e.target.value);
    fetch(`http://localhost:3004/posts/${e.target.value}`, {
      method: "DELETE"
    }).then(res => this.reloadData());
  }

  reloadData() {
    axios.get("http://localhost:3004/posts").then(res => {
      this.setState({
        dataApi: res.data,
        edit: false
      });
    });
  }

  inputChange(e) {
    let newdataPost = {...this.state.dataPost};
    if (this.state.edit === false) {
      newdataPost["id"] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;
    this.setState(
      {
        dataPost: newdataPost
      },
      () => console.log(this.state.dataPost)
    );
  }
  handleChange = date => {
    let newdataPost = {...this.state.dataPost};
    newdataPost["tanggal"] = date;
    this.setState(
      {
        startDate: date,
        dataPost: newdataPost
      },
      () => console.log(this.state.dataPost)
    );
  };
  onSubmitForm = () => {
    if (this.state.edit === false) {
      axios
        .post(`http://localhost:3004/posts`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        });
    } else {
      axios
        .put(
          `http://localhost:3004/posts/${this.state.dataPost.id}`,
          this.state.dataPost
        )
        .then(() => {
          this.reloadData();
          this.clearData();
        });
    }
  };
  clearData = () => {
    let newdataPost = {...this.state.dataPost};
    newdataPost["id"] = "";
    newdataPost["nama"] = "";
    newdataPost["jabatan"] = "";
    newdataPost["gender"] = "";
    newdataPost["tanggal"] = "";
    this.setState({
      dataPost: newdataPost
    });
  };
  getDataId = e => {
    axios.get(`http://localhost:3004/posts/${e.target.value}`).then(res => {
      res.data["tanggal"] = moment(res.data["tanggal"]).toDate();
      this.setState({
        dataPost: res.data,
        edit: true
      });
    });
  };
  componentDidMount() {
    this.reloadData();
  }
  render() {
    return (
      <div>
        <Menu>
          <Menu.Item name="karyawan">Karyawan</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item name="notif">
              <Icon name="bell" />
            </Menu.Item>
            <Menu.Item name="message">
              <Icon name="envelope" />
            </Menu.Item>
            <Menu.Item name="setting">
              <Icon name="setting" />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <Grid verticalAlign="middle" columns={4} centered stackable>
          <Grid.Column>
            <Segment stacked textAlign="center">
              <Header as="h2" content="INPUT DATA BARU" />
              <Form>
                <Form.Field>
                  <Input
                    placeholder="Nama Karyawan"
                    name="nama"
                    onChange={this.inputChange}
                    value={this.state.dataPost.nama || ""}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    placeholder="Jabatan"
                    name="jabatan"
                    onChange={this.inputChange}
                    value={this.state.dataPost.jabatan || ""}
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    placeholder="Jenis Kelamin"
                    name="gender"
                    onChange={this.inputChange}
                    value={this.state.dataPost.gender || ""}
                  />
                </Form.Field>
                <Form.Field className="customDatePickerWidth">
                  <DatePicker
                    placeholderText="Tanggal Lahir"
                    name="tanggal"
                    selected={this.state.dataPost.tanggal || ""}
                    onChange={this.handleChange}
                    dateFormat="yyyy-d-M"
                  />
                </Form.Field>
                <Button
                  type="submit"
                  color="teal"
                  fluid
                  onClick={this.onSubmitForm}
                >
                  Save
                </Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid>
        <Grid verticalAlign="middle" columns={2} centered stackable>
          <Grid.Column>
            <Segment>
              <center>
                <Header as="h2" content="DATA KARYAWAN" />
              </center>
              <br />
              <Grid columns={2}>
                <Grid.Row>
                  {this.state.dataApi.map((data, index) => {
                    return (
                      <Grid.Column key={index}>
                        <center>
                          <Card>
                            <Card.Content>
                              <Image
                                floated="right"
                                size="mini"
                                src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                              />
                              <Card.Header textAlign="left">
                                {data.nama}{" "}
                              </Card.Header>
                              <Card.Meta textAlign="left">
                                {data.jabatan}
                              </Card.Meta>
                              <Card.Description textAlign="left">
                                <p>{data.gender}</p>
                                <p>{data.tanggal}</p>
                              </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                              <div className="ui two buttons">
                                <Button
                                  basic
                                  color="green"
                                  value={data.id}
                                  onClick={this.getDataId}
                                >
                                  <Icon name="edit outline" />
                                </Button>
                                <Button
                                  basic
                                  color="red"
                                  value={data.id}
                                  onClick={this.handleRemove}
                                >
                                  <Icon name="close" />
                                </Button>
                              </div>
                            </Card.Content>
                          </Card>
                          <br />
                        </center>
                      </Grid.Column>
                    );
                  })}
                </Grid.Row>
              </Grid>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
