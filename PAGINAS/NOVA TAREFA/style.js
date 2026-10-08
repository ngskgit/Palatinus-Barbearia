import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
conteudo: {
flex: 1,
backgroundColor: "#fff",
paddingTop: 20
},

iconeAdd: {
color: "#fff",
fontSize: 20,
fontWeight: "bold"
},
Tarefas: {
width: "100%",
flexDirection: "row",
justifyContent: "space-between",
marginTop: 5,
}, 

deletartarefa:{
justifyContent: "center",
paddingLeft: 15
},

Icone: {
marginLeft:15
},

TextoDescricao: {
width: "75%",
alignContent: "flex-start",
backgroundColor: "#6EA1D6",
padding: 12,
paddingHorizontal: 20,
borderRadius: 70,
marginBottom: 5,
marginRight: 15,
color: "#1D1D1D",
},

botaoNovaTarefa:{
position: "absolute",
width: 60,
height: 60,
bottom: 50,
right: 20,
backgroundColor: "#1A42F0",
borderRadius: 50,
justifyContent: "center",
alignItems: "center",
},
});

export default styles;