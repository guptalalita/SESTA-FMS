import React, { Component } from "react";
import Layout from "../../hoc/Layout/Layout";
import * as serviceProvider from "../../api/Axios";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
} from "@material-ui/core";
import { map } from "lodash";
import validateInput from "../../components/Validation/ValidateInput/ValidateInput";
import { ADD_STATE_BREADCRUMBS, EDIT_STATE_BREADCRUMBS } from "./config";
import { Link } from "react-router-dom";
import Snackbar from "../../components/UI/Snackbar/Snackbar";
import Spinner from "../../components/Spinner/Spinner";

class StatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addIsActive: false,
      values: {},
      validations: {
        addState: {
          required: { value: "true", message: "State field required" },
        },
      },
      errors: {
        addState: [],
      },
      formSubmitted: "",
      errorCode: "",
      stateInUse: "",
      editPage: [
        this.props.match.params.id !== undefined ? true : false,
        this.props.match.params.id,
      ],
      isLoader: "",
    };
  }

  async componentDidMount() {
    if (this.state.editPage[0]) {
      this.setState({ isLoader: true });
      serviceProvider
        .serviceProviderForGetRequest(
          process.env.REACT_APP_SERVER_URL +
          "crm-plugin/states/?id=" +
          this.state.editPage[1]
        )
        .then((res) => {
          this.setState({
            values: {
              addState: res.data[0].name,
              active: res.data[0].is_active,
              addAbbreviation: res.data[0].Abbreviation,
              addIdentifier: res.data[0].Identifier,
            },
            addIsActive: res.data[0].is_active,
            isLoader: false,
          });
        })
        .catch((error) => {
          console.log(error);
        });
      serviceProvider
        .serviceProviderForGetRequest(
          process.env.REACT_APP_SERVER_URL +
          "crm-plugin/contact"
        )
        .then((res) => {
          res.data.map(cdata => {
            if (cdata.addresses.length > 0 && cdata.addresses[0].state !== null) {
              if (cdata.addresses[0].state === parseInt(this.state.editPage[1])) {
                this.setState({ stateInUse: true });
              }
            }
          })
        });
    }
  }

  handleChange = ({ target, event }) => {
    this.setState({
      values: { ...this.state.values, [target.name]: target.value },
    });
  };

  validate = () => {
    const values = this.state.values;
    const validations = this.state.validations;
    map(validations, (validation, key) => {
      let value = values[key] ? values[key] : "";
      const errors = validateInput(value, validation);
      let errorset = this.state.errors;
      if (errors.length > 0) errorset[key] = errors;
      else delete errorset[key];
      this.setState({ errors: errorset });
    });
  };

  hasError = (field) => {
    if (this.state.errors[field] !== undefined) {
      return Object.keys(this.state.errors).length > 0 &&
        this.state.errors[field].length > 0
        ? true
        : false;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.validate();
    this.setState({ formSubmitted: "" });
    if (Object.keys(this.state.errors).length > 0) return;
    let stateName = this.state.values.addState;
    let abbreviation = this.state.values.addAbbreviation;
    let identifier = this.state.values.addIdentifier;
    let IsActive = this.state.addIsActive;

    let postData = {
      name: stateName,
      is_active: IsActive,
      Abbreviation: abbreviation,
      Identifier: identifier,
    };

    if (this.state.editPage[0]) {
      // Code for Edit Data Page
      serviceProvider
        .serviceProviderForPutRequest(
          process.env.REACT_APP_SERVER_URL + "crm-plugin/states",
          this.state.editPage[1],
          postData
        )
        .then((res) => {
          this.setState({ formSubmitted: true });
          this.props.history.push({ pathname: "/states", editData: true });
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
    } else {
      //Code for Add Data Page
      serviceProvider
        .serviceProviderForPostRequest(
          process.env.REACT_APP_SERVER_URL + "crm-plugin/states/",
          postData
        )
        .then((res) => {
          this.setState({ formSubmitted: true });
          this.props.history.push({ pathname: "/states", addData: true });
          this.handleActive();
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
        });
    }
  };

  handleCheckBox = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  cancelForm = () => {
    this.setState({
      values: {},
      formSubmitted: "",
      stateSelected: false,
    });
  };

  render() {
    return (
      <Layout
        breadcrumbs={
          this.state.editPage[0]
            ? EDIT_STATE_BREADCRUMBS
            : ADD_STATE_BREADCRUMBS
        }
      >
        {!this.state.isLoader ? (
          <Card style={{ maxWidth: "45rem" }}>
            <form
              autoComplete="off"
              noValidate
              onSubmit={this.handleSubmit}
              method="post"
            >
              <CardHeader
                title={this.state.editPage[0] ? "Edit state" : "Add state"}
                subheader={
                  this.state.editPage[0]
                    ? "You can edit state data here!"
                    : "You can add new state data here!"
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    {this.state.formSubmitted === false ? (
                      <Snackbar severity="error" Showbutton={false}>
                        {this.state.errorCode}
                      </Snackbar>
                    ) : null}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Input
                      fullWidth
                      label="State Name*"
                      name="addState"
                      error={this.hasError("addState")}
                      helperText={
                        this.hasError("addState")
                          ? this.state.errors.addState[0]
                          : null
                      }
                      value={this.state.values.addState || ""}
                      onChange={this.handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Input
                      fullWidth
                      label="Identifier"
                      name="addIdentifier"
                      error={this.hasError("addIdentifier")}
                      helperText={
                        this.hasError("addIdentifier")
                          ? this.state.errors.addIdentifier[0]
                          : null
                      }
                      value={this.state.values.addIdentifier || ""}
                      onChange={this.handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Input
                      fullWidth
                      label="Abbreviation"
                      name="addAbbreviation"
                      error={this.hasError("addAbbreviation")}
                      helperText={
                        this.hasError("addAbbreviation")
                          ? this.state.errors.addAbbreviation[0]
                          : null
                      }
                      value={this.state.values.addAbbreviation || ""}
                      onChange={this.handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.addIsActive}
                          onChange={this.handleCheckBox}
                          name="addIsActive"
                          color="primary"
                          disabled={this.state.stateInUse ? true : false}
                        />
                      }
                      label="Active"
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions style={{ padding: "15px" }}>
                <Button type="submit">Save</Button>
                <Button
                  color="secondary"
                  clicked={this.cancelForm}
                  component={Link}
                  to="/states"
                >
                  Cancel
                </Button>
              </CardActions>
            </form>
          </Card>
        ) : (
          <Spinner />
        )}
      </Layout>
    );
  }
}

export default StatePage;
