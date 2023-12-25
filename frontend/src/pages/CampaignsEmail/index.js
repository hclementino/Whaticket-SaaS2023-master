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
import { i18n } from "../../translate/i18n"
import toastError from "../../errors/toastError";

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


const EmailModalCampaign = ({ open, onClose, company, setEmails }) => {

  const [emailForm, setEmailForm] = useState({
    name: "",
    companyId: company,
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");

 
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };
  const handleSaveEmail = async (values) => {
    try {
      const response = await api.post('/saveCampaignEmail', values);
  
      if (response.status === 200) {
        toast.success(`Campanha de e-mail salva com sucesso`);
        handleClose();
        const fetchData = async () => {
          const { data } = await api.get("/emails", {
            params: { searchParam, pageNumber },
          });
          setEmails(data.email);
        };
        fetchData();
      }
    } catch (err) {
      toastError(err);
    }
  };

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
          Criar nova campanha
        </DialogTitle>
        <Formik
          initialValues={emailForm}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveEmail(values);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Digite o nome da campanha"
                  name="name"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%' }}
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

export default EmailModalCampaign;
