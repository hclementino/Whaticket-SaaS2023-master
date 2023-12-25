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
import {
  Typography
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


const EmailModalCampaignValidation = ({ open, onClose, user, dns }) => {
 
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  const handleVerifyDNS = async () => {
    try {
      const response = await api.post(`/email/verify/${user.id}`);
      if (response.status === 200) {
        toast.success(`E-mail validado com sucesso`);
      }
    } catch (err) {
      toastError("Não foi possível validar o DNS, tente novamente mais tarde");
    }
  };



  return (
    <div className={classes.root}>
      <Dialog
        maxWidth="lg"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          Validação de DNS
        </DialogTitle>
        <Formik
          enableReinitialize={true}
          initialValues={""}
          onSubmit={(values, actions) => {
            setTimeout(() => {
            }, 400);
          }}
        >
          {({isSubmitting }) => (
            <Form>
<DialogContent dividers>
  <Typography>
    Para se proteger contra SPAM, adicione o seguinte registro SPF ao DNS do seu domínio {"(Opcional)"}:
  </Typography>
  <Typography>
    Nome: <strong>@</strong><br />
    Tipo: <strong>TXT</strong><br />
    Valor: <strong>v=spf1 include:{user.domain} -all</strong>
  </Typography>
</DialogContent>
<DialogContent>
  <Typography>
    Para verificar seu domínio, adicione o seguinte registro TXT ao DNS do seu domínio {"(Obrigatório)"}:
  </Typography>
  <Typography fullWidth >
    Nome: <strong>@</strong><br />
    Tipo: <strong>TXT</strong><br />
    Valor: <strong  style={{ wordWrap: "break-word" }}>{dns}</strong>
  </Typography>
</DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  variant="outlined"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onClick={handleVerifyDNS}
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  Verificar DNS
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default EmailModalCampaignValidation;
