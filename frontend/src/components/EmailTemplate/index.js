import React, { useRef } from 'react';
import json from './teste.json';
import EmailEditor from 'react-email-editor';
import { saveAs } from 'file-saver';
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";

const UnlayerEmailEditor = (props) => {
  const companyId = localStorage.getItem("companyId");

  const emailEditorRef = useRef(null);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { html } = data;
      
      const blob = new Blob([html], { type: 'text/html' });
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
  
      link.download = '../templates/email_template.html';
  
      document.body.appendChild(link);
      link.click();
  
      // Remove o link do documento
      document.body.removeChild(link);
    });
  };

  const handleSaveEmail = () => {
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design, html } = data;
  
      const designString = JSON.stringify(design);
  
      const saveTemplate = async () => {
        try {
          console.log({ design: designString })

          const response = await api.post('/saveTemplate', { content: designString, companyId: companyId }, { headers: { 'Content-Type': 'application/json' } });
  
          const responseHtml = await api.post('/saveTemplate', { content: html, companyId: companyId }, { headers: { 'Content-Type': 'application/json' } });

          if (response.status === 200 && responseHtml.status === 200) {
            toast.success(`Template de e-mail salvo com sucesso`);
          }
        } catch (err) {
          toastError(err);
        }
      };
  
      await saveTemplate();
    });
  };
  


  
  const onLoad = () => {
    const templateJson = { json };
    emailEditorRef.current.editor.loadDesign(templateJson.json);
  };

  const onReady = () => {
    console.log('onReady');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ marginLeft: 'auto', marginRight: 15, marginTop: 5 }}>
        <Button
          style={{ marginRight: 5, backgroundColor: 'green', color: 'white' }}
          variant="contained"
          onClick={() => exportHtml(true)}
        >
          Export HTML
        </Button>

        <Button
          style={{ marginRight: 5, backgroundColor: 'green', color: 'white' }}
          variant="contained"
          color="primary"
          onClick={() => handleSaveEmail(true)}
        >
          Save HTML
        </Button>
      </div>

      <EmailEditor
        style={{ flex: 1 }}
        ref={emailEditorRef}
        onLoad={onLoad}
        onReady={onReady}
        projectId={196915}
      />
    </div>
  );
};

export default UnlayerEmailEditor;
