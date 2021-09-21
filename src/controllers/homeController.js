const Contato = require('./../models/ContatoModels');

exports.index = async (req,res) =>{
	const contatos = await Contato.buscaContatos();
	res.render("index", {contatos});
};



