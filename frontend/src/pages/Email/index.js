import React, { useState, useEffect, useReducer, useContext } from "react";

import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import EmailModal from "../../components/EmailModal";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";
import EmailModalCampaign from "../CampaignsEmail";
import EditModalCampaign from "../../components/EditEmailModal/index";
import EmailEditorTemplate from "../../components/EmailTemplate/index";
import EmailModalCampaignValidation from "../../components/CampaignsEmailValidation/index";
import api from "../../services/api";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  header: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
}));

const Email = () => {
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));
  const classes = useStyles();
  const [confirmModalDeleteOpen, setConfirmModalDeleteOpen] = useState(false);
  const [newTemplateCampaignEditModalOpen, setNewTemplateCampaignEditModalOpen] = useState(false);
  const [newTemplateCampaignModalOpen, setNewTemplateCampaignModalOpen] = useState(false);
  const [newTemplateCampaignValidationOpen, setNewTemplateCampaignValidationOpen] = useState(false);
  const [emails, setEmails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [idEmail, setIdEmail] = useState();
  const [user, setUser] = useState(null);
  const [emailData, setEmailData] = useState();
  const [userDNS, setUserDNS] = useState(null);
  const [dkim, setDkim] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));


  const handleGenerateDNS = async () => {
    try {
      const response = await api.post('/keys', userDNS);
      if (response.status === 200) {
        setDkim(response.data);
        toast.success(`Chave gerada com sucesso`);
      }
    } catch (err) {
      toastError(err);
    }
  };


  useEffect(() => {
    const fetchEmailUser = async () => {
      try {
        const { data } = await api.get(`/users/${userId}`);
        setUser(data);

        const domain = data.email.match(/@(.+)$/);
        const domainName = domain ? domain[1] : null;
        setUserDNS({ companyId: data.companyId, domain: domainName, id:data.id });
      } catch (err) {
        toastError(err);
      }
    };

    fetchEmailUser();
  }, []);


  const fetchEmailInfo =  async (id) => {
    try {
      const { data } = await api.get(`/email/${id}`);
      setEmailData(data);

    } catch (err) {
      toastError(err);
    }
  }

  const handleEdit = async (email) => {
    setIdEmail(email);
    await fetchEmailInfo(email);
    setNewTemplateCampaignEditModalOpen(true);
  };
  


  const handleNewTemplateEditCampaignClose = () => {
    setNewTemplateCampaignEditModalOpen(false);
  };

  const handleNewTemplateCampaignClose = () => {
    setNewTemplateCampaignModalOpen(false);
  };

  const handleNewTemplateValidationCampaignClose = () => {
    setNewTemplateCampaignValidationOpen(false);
  };

  const handleOpenDns = () => {
    handleGenerateDNS();
    setNewTemplateCampaignValidationOpen(true)
  };

  const handleDelete = () => {
    console.log("Excluir");
  };

  const formatDate = (dataFormatada) => {
    const partesData = dataFormatada.split('-');
    const ano = partesData[0];
    const mes = partesData[1];
    const dia = partesData[2];
    const dateFormatBR = `${dia}/${mes}/${ano}`;
    return dateFormatBR;
  };


  useEffect(() => {
		const fetchData = async () => {
      const { data } = await api.get("/emails", {
        params: { searchParam, pageNumber },
      });
			setEmails(data.email);
		}
		fetchData();
	}, [searchParam, pageNumber]);

  return (
    <MainContainer className={classes.mainContainer}>

      <EmailModalCampaignValidation
        dns={dkim}
        user={userDNS}
        open={newTemplateCampaignValidationOpen}
        onClose={handleNewTemplateValidationCampaignClose}
      />

      <EmailModalCampaign
        company={companyId}
        setEmails={setEmails}
        open={newTemplateCampaignModalOpen}
        onClose={handleNewTemplateCampaignClose}
      />

      <EditModalCampaign
        emailInfo={emailData}
        idCampaignEmail={idEmail}
        open={newTemplateCampaignEditModalOpen}
        onClose={handleNewTemplateEditCampaignClose}
      />

    <ConfirmationModal
        title={`Você tem certeza que quer excluir esta campanha?`}
        open={confirmModalDeleteOpen}
        onClose={setConfirmModalDeleteOpen}
        onConfirm={handleDelete}
      >
        Esta ação não pode ser revertida.
      </ConfirmationModal>
      <MainHeader>
        <Title>E-MAIL</Title>
        <MainHeaderButtonsWrapper>
        <input
  type="file"
  id="fileInput"
  style={{ display: 'none' }}
/>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDns()}
      >
        VALIDAR DNS
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setNewTemplateCampaignModalOpen(true)}
      >
        CRIAR UMA CAMPANHA DE E-MAIL
      </Button>

        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
      >
<Table size="small">
  <TableHead>
    <TableRow>
      <TableCell align="center">Nome</TableCell>
      <TableCell align="left">Data de modificação</TableCell>
      <TableCell align="center">Ações</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
  {emails.map((email) => (
    <TableRow key={email.id}>
      <TableCell align="center">{email.name}</TableCell>
      <TableCell style={{ paddingLeft: 40 }} align="left">{formatDate(email.createdAt)}</TableCell>
      <TableCell align="center">
        <IconButton size="small" onClick={() => handleEdit(email.id)}>
          <EditIcon/>
        </IconButton>
        <IconButton size="small" onClick={() => {
            setConfirmModalDeleteOpen(true);
          }}>
          <DeleteOutlineIcon 
          />
        </IconButton>
      </TableCell>
    </TableRow>
    ))}
  </TableBody>
</Table>

        </Paper>
    </MainContainer>
  );
};

export default Email;
