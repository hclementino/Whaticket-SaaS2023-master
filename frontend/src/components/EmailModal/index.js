import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { i18n } from "../../translate/i18n";

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

const EmailModal = ({ open, onClose }) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="md"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          Inserir Template
        </DialogTitle>
        <Formik
          initialValues={{ text: '' }}
          enableReinitialize={true}
          // Substitua com o seu esquema de validação
          // validationSchema={ContactSchema}
          onSubmit={(values) => {
            // Substitua com a sua função de salvamento
            // handleSaveContact(values);
            console.log("Formulário enviado:", values);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Informe o código HTML do template"
                  name="text"
                  helperText={touched.text && errors.text}
                  placeholder="html"
                  variant="outlined"
                  margin="dense"
                  multiline  // Permitir múltiplas linhas
                  rows={10}   // Número desejado de linhas
                  fullWidth   // Preencher a largura total do contêiner
                />
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

export default EmailModal;
