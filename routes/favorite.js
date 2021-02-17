'use strict';

const express = require('express');
const router = new express.Router();
const Favorite = require('../models/favorite');
const routeGuard = require('../middleware/route-guard');
const axios = require('axios');
const listenNotesApiKey = process.env.LISTENNOTES_API_KEY;

router.get('/favorites-list', routeGuard, (req, res, next) => {
  res.render('favorites-list');
});

router.post(
  '/:id/add-to-favorites', routeGuard, async (req, res, next) => {
    const id = req.params.id;
    try {
      const response = await axios.get(
        `https://listen-api.listennotes.com/api/v2/podcasts/${id}`,
        {
          headers: {
            'X-ListenAPI-Key': `${listenNotesApiKey}`
          }
        }
      );
      const singlePodcast = response.data;
      const favoritePodcastTitle = singlePodcast.title;
      const favoritePodcastImage = singlePodcast.image;

      await Favorite.create({
      user: req.user._id,
      favoritePodcastId: id,
      favoritePodcastTitle: favoritePodcastTitle,
      favoritePodcastImage: favoritePodcastImage
    });
      res.redirect(`/episode/podcast/${id}`);
    } catch (error) {
        next(error);
      };
  });

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Favorite.findById(id)
    .then((favorite) => {
      res.render('single-podcast', { favorite });
    })
    .catch((error) => {
      next(error);
    });
});


router.post('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Favorite.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/favorites-list');
    })
    .catch((error) => {
      next(error);
    });
});

// router.get('/:id', (req, res, next) => {
// const podcastId = req.params.id;
// const favoritePodcast = podcastId.data;
// console.log(favoritePodcast)
//   Favorite.findById(favoritePodcast)
//     .then((favoritePodcast) => {
//     res.render('single-podcast', { favoritePodcast })
//     })
//     .catch((error) => {
//     next(error);
//     });
//   });


// router.get('/:id/update', routeGuard, (req, res, next) => {
//   const id = req.params.id;
//   Favorite.findById(id)
//     .then((favorite) => {
//       res.render('favorite/favorite-list-update', { favorite });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// router.post('/:id/update', routeGuard, (req, res, next) => {
//   const id = req.params.id;
//   const data = req.body;
//   Favorite.findByIdAndUpdate(id, {
//     name: data.name
//   })
//     .then((favorite) => {
//       res.render('favorite/favorite-list', { favorite });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// router.get('/:id/delete', routeGuard, (req, res, next) => {
//   const id = req.params.id;
//   Favorite.findById(id)
//     .then((favorite) => {
//       res.render('favorite/deletion-confirmation', { favorite });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

// router.get('/add-to-playlist', (req, res) => {
//   const id = req.params.id;
//   Favorite.findById(id)
//     .populate('podcast')
//     .then((podcast) => {
//       console.log(podcast);
//       res.render('single-podcast', { podcast });
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

module.exports = router;
