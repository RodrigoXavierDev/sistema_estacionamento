// Acessa os serviços do Firebase através de `window.firebase`
const db = window.firebase.firestore();
const auth = window.firebase.auth();

// Exemplo: Autenticação anônima
auth().signInAnonymously().then(() => {
  console.log('Usuário autenticado anonimamente');
}).catch(error => {
  console.error('Erro na autenticação:', error);
});
