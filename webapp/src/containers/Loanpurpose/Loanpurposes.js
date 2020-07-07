import React from "react";
import axios from "axios";
import Table from "../../components/Datatable/Datatable.js";
import Layout from "../../hoc/Layout/Layout";
import Button from "../../components/UI/Button/Button";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import style from "./Loanpurpose.module.css";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";
import auth from "../../components/Auth/Auth.js";
import Input from "../../components/UI/Input/Input";
import Snackbar from "../../components/UI/Snackbar/Snackbar";

const useStyles = (theme) => ({
  root: {},
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  floatRow: {
    height: "40px",
    float: "right",
  },
  buttonRow: {
    height: "42px",
    float: "right",
  },
  spacer: {
    flexGrow: 1,
  },
  addButton: {
    float: "right",
    marginRight: theme.spacing(1),
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
});

export class Loanpurposes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Result: [],
      data: [],
      selectedid: 0,
      open: false,
      columnsvalue: [],
      DeleteData: false,
      properties: props,
      isCancel: false,
      singleDelete: "",
      multipleDelete: "",
    };

    let history = props;
  }

  async componentDidMount() {
    //api call for loanpurpose filter
    await axios
      .get(process.env.REACT_APP_SERVER_URL + "loanmodels/", {
        headers: {
          Authorization: "Bearer " + auth.getToken() + "",
        },
      })
      .then((res) => {
        this.setState({ data: res.data });
        console.log("---data----", this.state.data);
      })
      .catch((error) => {
        console.log("---data----", this.state.data);
        console.log(error);
      });
    console.log("---data----", this.state.data);
  }

  editData = (cellid) => {
    this.props.history.push("/loanpurpose/edit/" + cellid);
    console.log("---data in edit---", this.state.data);
  };

  DeleteData = (cellid, selectedId) => {
    if (cellid.length !== null && selectedId < 1) {
      this.setState({ singleDelete: "", multipleDelete: "" });

      axios
        .delete(
          process.env.REACT_APP_SERVER_URL +
            JSON.parse(process.env.REACT_APP_CONTACT_TYPE)["Organization"][0] +
            "s/" +
            cellid,
          {
            headers: {
              Authorization: "Bearer " + auth.getToken() + "",
            },
          }
        )
        .then((res) => {
          this.setState({ singleDelete: res.data.name });
          this.componentDidMount();
        })
        .catch((error) => {
          this.setState({ singleDelete: false });
          console.log(error.response);
        });
    }
  };
  DeleteAll = (selectedId) => {
    if (selectedId.length !== 0) {
      this.setState({ singleDelete: "", multipleDelete: "" });
      for (let i in selectedId) {
        axios
          .delete(
            process.env.REACT_APP_SERVER_URL +
              JSON.parse(process.env.REACT_APP_CONTACT_TYPE)[
                "Organization"
              ][0] +
              "s/" +
              selectedId[i],
            {
              headers: {
                Authorization: "Bearer " + auth.getToken() + "",
              },
            }
          )
          .then((res) => {
            this.setState({ multipleDelete: true });
            this.componentDidMount();
          })
          .catch((error) => {
            this.setState({ multipleDelete: false });

            console.log("err", error);
          });
      }
    }
  };
  cancelForm = () => {
    this.setState({
      isCancel: true,
    });

    this.componentDidMount();
  };

  handleSearch() {}

  render() {
    let data = this.state.data;
    console.log("---data in render--", data, this.state.data);
    if (data.length !== 0) {
    }

    const Usercolumns = [
      {
        name: "Name of the Purpose",
        selector: "name",
      },
      {
        name: "Duration(months)",
        selector: "duration",
      },
      {
        name: "EMI",
        selector: "emi",
      },
      {
        name: "FPO",
        selector: "fpo",
      },
    ];

    let selectors = [];
    for (let i in Usercolumns) {
      selectors.push(Usercolumns[i]["selector"]);
    }

    let columnsvalue = [0];
    const { classes } = this.props;

    return (
      <Layout>
        <Grid>
          <div className="App">
            <h1 className={style.title}>
              {" "}
              Manage Loan Purpose
              <div className={classes.floatRow}>
                <div className={classes.buttonRow}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/Loanpurposes/add"
                  >
                    Add Loan Purpose
                  </Button>
                </div>
              </div>
            </h1>
            {this.props.location.addVoData ? (
              <Snackbar severity="success">
                Loan Purpose added successfully.
              </Snackbar>
            ) : this.props.location.editVoData ? (
              <Snackbar severity="success">
                Loan Purpose edited successfully.
              </Snackbar>
            ) : null}
            {this.state.singleDelete !== false &&
            this.state.singleDelete !== "" &&
            this.state.singleDelete ? (
              <Snackbar severity="success" Showbutton={false}>
                Loan Purpose {this.state.singleDelete} deleted successfully!
              </Snackbar>
            ) : null}
            {this.state.singleDelete === false ? (
              <Snackbar severity="error" Showbutton={false}>
                An error occured - Please try again!
              </Snackbar>
            ) : null}
            {this.state.multipleDelete === true ? (
              <Snackbar severity="success" Showbutton={false}>
                Loan Purposes deleted successfully!
              </Snackbar>
            ) : null}
            {this.state.multipleDelete === false ? (
              <Snackbar severity="error" Showbutton={false}>
                An error occured - Please try again!
              </Snackbar>
            ) : null}
            <div className={classes.row}>
              <div className={classes.searchInput}>
                <div className={style.Districts}>
                  <Grid item md={12} xs={12}>
                    <Input
                      fullWidth
                      label="Purpose"
                      name=""
                      id="combo-box-demo"
                      value={""}
                      // onChange={this.handleChange.bind(this)}
                      variant="outlined"
                    />
                  </Grid>
                </div>
              </div>
              <br></br>
              <Button
                variant="contained"
                onClick={this.handleSearch.bind(this)}
              >
                Search
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                color="secondary"
                variant="contained"
                // clicked={this.cancelForm}
                onClick={this.cancelForm.bind(this)}
              >
                Cancel
              </Button>
            </div>
            {data ? (
              <Table
                title={"Loan Purposes"}
                filterData={true}
                showSearch={false}
                Searchplaceholder={"Search by loan purpose"}
                filterBy={["name"]}
                data={data}
                column={Usercolumns}
                editData={this.editData}
                DeleteData={this.DeleteData}
                DeleteAll={this.DeleteAll}
                rowsSelected={this.rowsSelect}
                modalHandle={this.modalHandle}
                columnsvalue={columnsvalue}
                DeleteMessage={"Are you Sure you want to Delete"}
              />
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        </Grid>
      </Layout>
    );
  }
}
export default withStyles(useStyles)(Loanpurposes);