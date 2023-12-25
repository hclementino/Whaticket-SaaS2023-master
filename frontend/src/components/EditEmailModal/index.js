import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import api from "../../services/api";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
  } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  extraAttr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));


const EditModalCampaign = ({ open, onClose, company, emailInfo }) => {

  const [emailForm, setEmailForm] = useState({
    name: "",
    title: "",
    description: "",
    sender: "",
    recipient: "",
    template: "",
    companyId: company,
  });
  const [contactList, setContactList] = useState([]);
  const [user, setUser] = useState(null);
  const [emailData, setEmailInfo] = useState(emailInfo);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const fetchContactList = async () => {
      try {
        const { data } = await api.get(`/contact-lists`);
        setContactList(data.records);
      } catch (err) {
        toastError(err);
      }
    };

    fetchContactList();
  }, []);

  useEffect(() => {
    const fetchEmailUser = async () => {
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(data);
      } catch (err) {
        toastError(err);
      }
    };

    fetchEmailUser();
  }, []);



  return (
    <div className={classes.root}>

      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          Editar Campanha
        </DialogTitle>
        <Formik
          initialValues={emailForm}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setTimeout(() => {
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Editar campanha"
                  name="name"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  value={emailInfo.name || ""}
                  margin="dense"
                  style={{ width: '100%', marginBottom: 10 }}
                />

                <Field
                  as={TextField}
                  label="Título"
                  name="title"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%', marginBottom: 10 }}
                />

                <Field
                  as={TextField}
                  label="Descrição"
                  name="description"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%', marginBottom: 10 }}
                />
<Field
  as={Select}
  label="Selecione o remetente"
  name="sender"
  variant="outlined"
  margin="dense"
  style={{ width: '100%', marginBottom: 10 }}
  displayEmpty
>
  <MenuItem value="" disabled>
  Selecione o remetente
  </MenuItem>
    <MenuItem key={user.id} value={user.id}>
      {user.email}
    </MenuItem>
</Field>


<Field
  as={Select}
  label="Selecione a lista de destinatários"
  name="recipient"
  variant="outlined"
  margin="dense"
  style={{ width: '100%', marginBottom: 10 }}
  displayEmpty
>
  <MenuItem value="" disabled>
    Selecione a lista de destinatários
  </MenuItem>
  {contactList.map((list) => (
    <MenuItem key={list.id} value={list.id}>
      {list.name}
    </MenuItem>
  ))}
</Field>
<Field
  as={Select}
  label="Selecione o template"
  name="template"
  variant="outlined"
  margin="dense"
  style={{ width: '100%', marginBottom: 10 }}
  displayEmpty
>
  <MenuItem value="" disabled>
    Selecione o template
  </MenuItem>

</Field>

              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  ADICIONAR
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default EditModalCampaign;
