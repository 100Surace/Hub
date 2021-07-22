import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@material-ui/core';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ProductCollectionForm } from '../../components/_dashboard/e-commerce/product-collection';
import { getProductCollectionById } from '../../redux/slices/productCollection';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const dispatch = useDispatch();
  const { edit } = useParams();
  const { productCollection } = useSelector((state) => state.productCollection);
  const { search } = useLocation();
  const editId = search.split('=')[1];
  const isEdit = Boolean(editId);

  useEffect(() => {
    dispatch(getProductCollectionById(editId));
  }, []);

  return (
    <Page title="Create a new product collection">
      <Container>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Create a new product collection' : 'Edit product collection'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Product Collection',
              href: PATH_DASHBOARD.productCollection.root
            },
            { name: !isEdit ? 'New product collection' : productCollection.collectionName }
          ]}
        />

        <ProductCollectionForm isEdit={isEdit} currentCollection={productCollection} />
      </Container>
    </Page>
  );
}
