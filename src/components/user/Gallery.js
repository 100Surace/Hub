import { Grid, Card, CardContent } from '@material-ui/core';
import LazySize from '../LazySize';

function GalleryItem({ image, onOpenLightbox }) {
  const classes = useStyles();
  const { imageUrl, title, postAt } = image;
  return (
    <Card sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
      <LazySize
        alt="gallery image"
        src={imageUrl.small}
        size={`${imageUrl.small} 600w, ${imageUrl.medium} 960w`}
        onClick={() => onOpenLightbox(imageUrl.large)}
        sx={{ top: 0, width: '100%', height: '100%', position: 'absolute' }}
      />
    </Card>
  );
}

function Gallery() {
  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {gallery.map((image) => (
              <Grid key={image.id} item xs={12} sm={6} lg={4}>
                <GalleryItem
                  image={image}
                  onOpenLightbox={handleOpenLightbox}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default Gallery;
