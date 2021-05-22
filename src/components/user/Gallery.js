import { Grid, Box, Card, CardContent } from '@material-ui/core';
import { alpha, makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(5)
  },
  cardContent: {
    bottom: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    backdropFilter: 'blur(3px)',
    justifyContent: 'space-between',
    color: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.grey[900], 0.72),
    borderBottomLeftRadius: theme.shape.borderRadiusMd,
    borderBottomRightRadius: theme.shape.borderRadiusMd
  },
  image: {
    borderRadius: '5px'
  }
}));

const baseUrl = process.env.REACT_APP_API_SERVER;

GalleryItem.propTypes = {
  image: PropTypes.array.isRequired,
  remove: PropTypes.func
};

function GalleryItem({ image, remove }) {
  const classes = useStyles();

  const renderImage = (imageUrl) => {
    let imageView;
    if (typeof imageUrl === 'string') {
      imageView = (
        <>
          <Box
            component="img"
            alt="org image"
            src={`${baseUrl}/${imageUrl}`}
            className={classes.image}
          />
          <button onClick={() => remove(imageUrl)}>Remove</button>
        </>
      );
    } else {
      imageView = (
        <>
          <Box
            component="img"
            alt="org image"
            src={URL.createObjectURL(imageUrl)}
            size="100vw"
            sx={{ zIndex: 8, objectFit: 'cover' }}
          />
          <button onClick={() => remove(imageUrl, true)}>Remove</button>
        </>
      );
    }
    return imageView;
  };

  return <>{renderImage(image)}</>;
}

GalleryCards.propTypes = {
  gallery: PropTypes.array.isRequired,
  remove: PropTypes.func
};

function GalleryCards({ gallery, remove }) {
  const classes = useStyles();
  const renderGallery = (gallery) => {
    let galleryList;
    if (gallery.length === 0) {
      galleryList = null;
    } else {
      galleryList = gallery.map((image, index) => (
        <Grid key={index} item xs={2} sm={5}>
          <GalleryItem image={image} remove={remove} />
        </Grid>
      ));
    }
    return galleryList;
  };
  return (
    <Grid container spacing={3}>
      {renderGallery(gallery)}
    </Grid>
  );
}

export default GalleryCards;
