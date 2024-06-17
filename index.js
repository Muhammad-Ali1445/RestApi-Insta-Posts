const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let instaPost = [
    {
        id: uuidv4(),
        username: 'Ali Munir',
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        caption: 'Hi! I am a Programmer!',
    },
    {
        id: uuidv4(),
        username: 'Farman Kamboo',
        imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        caption: 'Make Something Different in this World',
    },
    {
        id: uuidv4(),
        username: 'Nouman Faqeer',
        imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        caption: 'Live,Love,laugh and Code',
    },
];

app.get('/instaPosts', (req, res) => {
    console.log('Request is Working');
    res.render('index', { instaPost });
});

app.get('/instaPosts/new', (req, res) => {
    res.render('new');
});

app.post('/instaPosts', async (req, res) => {
    const { username, caption } = req.body;

    let imageUrl = 'https://randomuser.me/api/portraits/lego/1.jpg'; // Default fallback image
    try {
        const response = await axios.get('https://randomuser.me/api/');
        imageUrl = response.data.results[0].picture.large;
    } catch (error) {
        console.error('Error fetching random user image:', error);
    }

    instaPost.push({ id: uuidv4(), username, imageUrl, caption });
    res.redirect('/instaPosts');
});

app.get("/instaPosts/:id", (req, res) => {
    let { id } = req.params;
    let searchPostById = instaPost.find((p) => id === p.id);
    if (searchPostById) {
        res.render("show", { searchPostById });
    } else {
        res.status(404).send("Post Not Found");
    }
});

app.patch("/instaPosts/:id", (req, res) => {
    let { id } = req.params;
    let newCaption = req.body.caption;
    let searchPostById = instaPost.find((p) => id === p.id);
    if (searchPostById) {
        searchPostById.caption = newCaption;
        res.redirect("/instaPosts");
    } else {
        res.status(404).send("Post Not Found");
    }
});

app.get('/instaPosts/:id/:edit', (req, res) => {
    let { id } = req.params;
    let searchPostById = instaPost.find((p) => id === p.id);
    res.render("edit", { searchPostById });
});

app.delete("/instaPosts/:id", (req, res) => {
    let { id } = req.params;
    instaPost = instaPost.filter((p) => id !== p.id);
    res.redirect("/instaPosts");
});

app.listen(port, () => {
    console.log(`Server is listening on Port ${port}`);
});
