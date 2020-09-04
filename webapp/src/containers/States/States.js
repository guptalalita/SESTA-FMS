import React from "react";
import * as serviceProvider from "../../api/Axios";
import Table from "../../components/Datatable/Datatable.js";
import Layout from "../../hoc/Layout/Layout";
import Button from "../../components/UI/Button/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import style from "./States.module.css";
import { Grid } from "@material-ui/core";
import Input from "../../components/UI/Input/Input";
import Snackbar from "../../components/UI/Snackbar/Snackbar";
import Modal from "../../components/UI/Modal/Modal.js";
import Switch from "../../components/UI/Switch/Switch";

const useStyles = (theme) => ({
  root: {},
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  buttonRow: {
    height: "42px",
    marginTop: theme.spacing(1),
    float: "right",
  },
  spacer: {
    flexGrow: 1,
  },
  addButton: {
    float: "right",
    marginRight: theme.spacing(1),
  },
  floatRow: {
    height: "40px",
    float: "right",
  },
  searchInput: {
    marginRight: theme.spacing(1),
  },
  Districts: {
    marginRight: theme.spacing(1),
  },
  States: {
    marginRight: theme.spacing(1),
  },
  Search: {
    marginRight: theme.spacing(1),
  },
  Cancel: {
    marginRight: theme.spacing(1),
  },
  menuName: {
    position: "relative",
    top: "20px",
  },
});

export class States extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
      FilterState: "",
      data: [],
      isActiveAllShowing: false,
      columnsvalue: [],
      DeleteData: false,
      isCancel: false,
      dataCellId: [],
      singleDelete: "",
      multipleDelete: "",
      active: {},
      allIsActive: [],
    };
    this.snackbar = React.createRef();
  }

  async componentDidMount() {
    serviceProvider
      .serviceProviderForGetRequest(
        process.env.REACT_APP_SERVER_URL + "crm-plugin/states/?_sort=name:ASC"
      )
      .then((res) => {
        this.setState({ data: res.data });
      });
  }

  StateFilter(event, value, target) {
    this.setState({
      values: { ...this.state.values, [event.target.name]: event.target.value },
    });
  }

  getData(result) {
    for (let i in result) {
      let states = [];
      for (let j in result[i].states) {
        states.push(result[i].states[j].name + " ");
      }
      result[i]["states"] = states;
    }
    return result;
  }

  handleSearch() {
    let searchData = "";
    if (this.state.values.FilterState) {
      searchData += "name_contains=" + this.state.values.FilterState;
    }
    serviceProvider
      .serviceProviderForGetRequest(
        process.env.REACT_APP_SERVER_URL +
          "crm-plugin/states/?" +
          searchData +
          "&&_sort=name:ASC"
      )
      .then((res) => {
        this.setState({ data: this.getData(res.data) });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  editData = (cellid) => {
    this.props.history.push("/states/edit/" + cellid);
  };

  cancelForm = () => {
    this.setState({
      FilterState: "",
      values: {},
      formSubmitted: "",
      stateSelected: false,
      isCancel: true,
    });
    this.componentDidMount();
  };

  DeleteData = (cellid, selectedId) => {
    if (cellid.length !== null && selectedId < 1) {
      this.setState({ singleDelete: "", multipleDelete: "" });
      serviceProvider
        .serviceProviderForDeleteRequest(
          process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
          cellid
        )
        .then((res) => {
          this.setState({ singleDelete: res.data.name });
          this.setState({ dataCellId: "" });
          this.componentDidMount();
        })
        .catch((error) => {
          this.setState({ singleDelete: false });
          console.log(error);
        });
    }
  };

  DeleteAll = (selectedId) => {
    if (selectedId.length !== 0) {
      this.setState({ singleDelete: "", multipleDelete: "" });
      for (let i in selectedId) {
        serviceProvider
          .serviceProviderForDeleteRequest(
            process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
            selectedId[i]
          )
          .then((res) => {
            this.setState({ multipleDelete: true });
            this.componentDidMount();
          })
          .catch((error) => {
            this.setState({ multipleDelete: false });
            console.log(error);
          });
      }
    }
  };

  ActiveAll = (selectedId, selected) => {
    if (selectedId.length !== 0) {
      let numberOfIsActive = [];
      for (let i in selected) {
        numberOfIsActive.push(selected[i]["is_active"]);
      }
      this.setState({ allIsActive: numberOfIsActive });
      let IsActive = "";
      numberOfIsActive.forEach((element, index) => {
        if (numberOfIsActive[index] === true) {
          IsActive = false;
        } else {
          IsActive = true;
        }

        let setActiveId = selectedId[index];
        serviceProvider
          .serviceProviderForPutRequest(
            process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
            setActiveId,
            {
              is_active: IsActive,
            }
          )
          .then((res) => {
            this.setState({ formSubmitted: true });
            this.componentDidMount({ updateData: true });
            this.props.history.push({
              pathname: "/states",
              updateData: true,
            });
            this.clearSelected(selected);
          })
          .catch((error) => {
            this.setState({ formSubmitted: false });
            if (error.response !== undefined) {
              this.setState({
                errorCode:
                  error.response.data.statusCode +
                  " Error- " +
                  error.response.data.error +
                  " Message- " +
                  error.response.data.message +
                  " Please try again!",
              });
            } else {
              this.setState({
                errorCode: "Network Error - Please try again!",
              });
            }
            console.log(error);
          });
      });
    }
  };

  clearSelected = (selected) => {
    let clearselected = "";
  };

  confirmActive = (event) => {
    this.setState({ isActiveAllShowing: true });
    this.setState({ setActiveId: event.target.id });
    this.setState({ IsActive: event.target.checked });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleActive = (event) => {
    this.setState({ isActiveAllShowing: false });
    let setActiveId = this.state.setActiveId;
    let IsActive = this.state.IsActive;
    serviceProvider
      .serviceProviderForPutRequest(
        process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
        setActiveId,
        {
          is_active: IsActive,
        }
      )
      .then((res) => {
        this.setState({ formSubmitted: true });
        this.setState({ open: true });
        this.componentDidMount({ updateData: true });
        this.props.history.push({ pathname: "/states", updateData: true });
        if (this.props.location.updateData && this.snackbar.current !== null) {
          this.snackbar.current.handleClick();
        }
      })
      .catch((error) => {
        this.setState({ formSubmitted: false });
        if (error.response !== undefined) {
          this.setState({
            errorCode:
              error.response.data.statusCode +
              " Error- " +
              error.response.data.error +
              " Message- " +
              error.response.data.message +
              " Please try again!",
          });
        } else {
          this.setState({ errorCode: "Network Error - Please try again!" });
        }
        console.log(error);
      });
  };

  closeActiveAllModalHandler = (event) => {
    this.setState({ isActiveAllShowing: false });
  };

  handleCheckBox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
    this.setState({ addIsActive: true });
  };

  render() {
    let data = this.state.data;
    const Usercolumns = [
      {
        name: "State",
        selector: "name",
        sortable: true,
      },
      {
        name: "Active",
        cell: (cell) => (
          <Switch
            id={cell.id}
            onChange={(e) => {
              this.confirmActive(e);
            }}
            defaultChecked={cell.is_active}
            Small={true}
          />
        ),
        sortable: true,
        button: true,
      },
    ];

    let selectors = [];
    for (let i in Usercolumns) {
      selectors.push(Usercolumns[i]["selector"]);
    }

    let columnsvalue = selectors[0];
    const { classes } = this.props;
    let filters = this.state.values;

    return (
      <Layout>
        <Grid>
          <div className="App">
            <h5 className={classes.menuName}>MASTERS</h5>
            <h2 className={style.title}>
              Manage States
              <div className={classes.floatRow}>
                <div className={classes.buttonRow}>
                  <Button variant="contained" component={Link} to="/states/add">
                    Add State
                  </Button>
                </div>
              </div>
            </h2>
            {this.props.location.addData ? (
              <Snackbar severity="success">State added successfully.</Snackbar>
            ) : null}
            {this.props.location.editData ? (
              <Snackbar severity="success">State edited successfully.</Snackbar>
            ) : null}
            {this.props.location.updateData ? (
              <Snackbar
                ref={this.snackbar}
                open={true}
                autoHideDuration={4000}
                severity="success"
              >
                State updated successfully.
              </Snackbar>
            ) : null}
            {this.state.singleDelete !== false &&
            this.state.singleDelete !== "" &&
            this.state.singleDelete ? (
              <Snackbar severity="success" Showbutton={false}>
                State {this.state.singleDelete} deleted successfully!
              </Snackbar>
            ) : null}
            {this.state.singleDelete === false ? (
              <Snackbar severity="error" Showbutton={false}>
                An error occured - Please try again!
              </Snackbar>
            ) : null}
            {this.state.multipleDelete === true ? (
              <Snackbar severity="success" Showbutton={false}>
                States deleted successfully!
              </Snackbar>
            ) : null}
            {this.state.multipleDelete === false ? (
              <Snackbar severity="error" Showbutton={false}>
                An error occured - Please try again!
              </Snackbar>
            ) : null}
            <br></br>
            <div className={classes.row}>
              <div className={classes.searchInput}>
                <div className={style.Districts}>
                  <Grid item md={12} xs={12}>
                    <Input
                      fullWidth
                      label="State Name"
                      name="FilterState"
                      variant="outlined"
                      onChange={(event, value) => {
                        this.StateFilter(event, value);
                      }}
                      value={this.state.values.FilterState || ""}
                    />
                  </Grid>
                </div>
              </div>
              <div className={classes.searchInput}>
                <Button onClick={this.handleSearch.bind(this)}>Search</Button>
                &nbsp;&nbsp;&nbsp;
                <Button color="secondary" clicked={this.cancelForm}>
                  Reset
                </Button>
              </div>
            </div>
            <br></br>
            {data ? (
              <Table
                title={"States"}
                showSearch={false}
                filterData={true}
                allIsActive={this.state.allIsActive}
                Searchplaceholder={"Search by State Name"}
                filterBy={["name"]}
                filters={filters}
                data={data}
                column={Usercolumns}
                editData={this.editData}
                DeleteData={this.DeleteData}
                clearSelected={this.clearSelected}
                DeleteAll={this.DeleteAll}
                handleActive={this.handleActive}
                ActiveAll={this.ActiveAll}
                rowsSelected={this.rowsSelect}
                columnsvalue={columnsvalue}
                selectableRows
                pagination
                DeleteMessage={"Are you Sure you want to Delete"}
                ActiveMessage={
                  "Are you Sure you want to Deactivate selected State"
                }
              />
            ) : (
              <h1>Loading...</h1>
            )}
            <Modal
              className="modal"
              show={this.state.isActiveAllShowing}
              close={this.closeActiveAllModalHandler}
              displayCross={{ display: "none" }}
              handleEventChange={true}
              event={this.handleActive}
              footer={{
                footerSaveName: "OKAY",
                footerCloseName: "CLOSE",
                displayClose: { display: "true" },
                displaySave: { display: "true" },
              }}
            >
              {this.state.IsActive
                ? " Do you want to set selected Active ?"
                : "Do you want to Deactivate selected State.?"}
            </Modal>
          </div>
        </Grid>
      </Layout>
    );
  }
}
export default withStyles(useStyles)(States);
