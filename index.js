const Discord = require("discord.js");
const config = require("./config.json");
const cmd = require("./cmd.json");
var mysql = require('mysql');

const client = new Discord.Client();

client.prefix = config.prefix; // Attach prefix to client to be used later and everywhere

var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

con.connect(err => {
	if (err) throw err;
	console.log("Connected to database");
});

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
	client.user.setActivity(`${client.prefix}help | ${client.guilds.size} servers!`, {type: 'Playing'});
});

client.on('guildCreate', async guild => {
	client.user.setActivity(`${client.prefix}help | ${client.guilds.size} servers!`, {type: 'Playing'});
	const embed = new Discord.RichEmbed()
	.setColor([0, 140, 0])
	.setAuthor("New Server")
	.setDescription("Name: **" + guild.name + "**"
                   	+ "\nOwner: **" + guild.owner.user.username + "**#" + guild.owner.user.discriminator
                  	+ "\nMembers: **" + guild.memberCount + "**")
	.setThumbnail(guild.iconURL)
	.setTimestamp();
	const channel = client.channels.get('468683498568417282');
	if (!channel) return;
	channel.send(embed);
});

client.on('guildDelete', async guild => {
	client.user.setActivity(`${client.prefix}help | ${client.guilds.size} servers!`, {type: 'Playing'});
	const embed = new Discord.RichEmbed()
	.setColor([140, 0, 0])
	.setAuthor("Bye Server")
	.setDescription("Name: **" + guild.name + "**"
                   	+ "\nOwner: **" + guild.owner.user.username + "**#" + guild.owner.user.discriminator
                   	+ "\nMembers: **" + guild.memberCount + "**")
	.setThumbnail(guild.iconURL)
	.setTimestamp();
	const channel = client.channels.get('468684109150158859');
	if (!channel) return;
	channel.send(embed);
});

client.on("message", async message => {
	let msg = message.content.toLowerCase();
	if (message.author.bot) return undefined;

	if (message.content.indexOf(client.prefix) !== 0) return;
	const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	try {
		const a = `${command}`;
		const b = `${cmd.` + a + `}`;
		let commands = require(`./commands/${b}.js`);
		commands.run(client, message, args);
	} catch(e) {
		console.log(e);
	} finally {
	}
});

client.login(process.env.TOKEN);
