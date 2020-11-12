import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { useNonFungibleStateContext } from '../NonFungibleState.js';

function getName(n) {
  var lbls = n.split('-');
  var res = lbls.filter(w => (w !== 'robot' && w!== 'spot'));
  if (res.length > 0) {
    return res.join(' ');
  } else {
    return n;
  }
}

const Robot = (props) => {
  const { nonFungibleState, setBasket, setNonFungibleState } = useNonFungibleStateContext();
  const handleClick = () => {
    setBasket(nonFungibleState.basket.concat([props.data.id]));
  };
  const handleSell = () => {
    var forsales = nonFungibleState.forsales;
    forsales.push(props.data.id);
    setNonFungibleState({
      forsales: forsales,
      botwallet: nonFungibleState.botwallet.filter(id => id !== props.data.id),
      basket: nonFungibleState.basket
    })
  }
  return (
    <div>
    <Paper elevation={1} style={{ width:200 }}>
      <Grid container direction='column' justify="center" alignItems="center">
        <Grid itemProp> {
          (props.value === 0) ? (
            <Button
              startIcon={<LocalOfferIcon />}
              variant='outlined'
              color='secondary'
              style={{ marginTop: 16 }}
              disabled={!props.ready || nonFungibleState.basket.includes(props.data.id)}
              onClick={handleClick}
            >
              buy <Typography style={{ color: 'black', marginLeft:7 }}>{props.data.price}ꜩ</Typography>
            </Button>
          ):(
            <div></div>
          )
        }
        </Grid>
        <Grid item>
          <img src={process.env.PUBLIC_URL + "/images/streamline-icon-" + props.data.name + "@200x200.svg"}></img>
        </Grid>
        <Grid item>
          <Typography style={{
            fontFamily: 'Orbitron',
            textTransform: 'capitalize',
            textAlign: 'center'
          }}> { getName(props.data.name) } </Typography>
          <Typography
            color='textSecondary'
            style={{
            fontFamily: 'Orbitron',
            textAlign: 'center',
            marginBottom: 16
          }}> #{ getName(props.data.id) } </Typography>
        </Grid>
      </Grid>
    </Paper>
    { (props.value === 1)? (
      <Grid container direction='row' justify="center" alignItems="center" spacing={0} style={{ marginTop: 16 }}>
        <Grid item xs={1}></Grid>
        <Grid item xs={3}>
          <Typography color='textSecondary'>value:</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color='textSecondary'>{props.data.price}ꜩ</Typography>
        </Grid>
        <Grid item xs={4}>
          <Button color='secondary' variant='outlined' disableElevation size='small' onClick={handleSell}>sell</Button>
        </Grid>
      </Grid>
    ) : (
      <div></div>
    )}
    </div>
  )
}

export default Robot;