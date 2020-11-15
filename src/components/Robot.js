import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { useNonFungibleStateContext } from '../NonFungibleState.js';
import { contractAddress } from '../settings';
import { useTezos } from '../dapp';

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
  const { nonFungibleState, setBasket, setNotReady } = useNonFungibleStateContext();
  const tezos = useTezos();
  const handleClick = () => {
    setBasket(nonFungibleState.basket.concat([props.data.id]));
  };
  const handleSell = () => {
    tezos.wallet.at(contractAddress).then(contract => {
      contract.methods.sell(props.data.id).send().then(op => {
        props.openSnack();
        op.receipt().then(() => {
          props.closeSnack();
          setNotReady();
        })
      })
    });
  }
  const sold = nonFungibleState.forsales.includes(props.data.id);
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
          { (sold && props.value !== 0)? (
            <img src={process.env.PUBLIC_URL + "/images/streamline-icon-" + props.data.name + "@200x200.svg"} style={{
              filter: 'grayscale(1) blur(0px)'
            }}></img>
          ):(
            <img src={process.env.PUBLIC_URL + "/images/streamline-icon-" + props.data.name + "@200x200.svg"}></img>
          ) }
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
          { (sold)? (
            <Typography color='textSecondary'>Sold</Typography>
            ):(
            <Button color='secondary' variant='outlined' disableElevation size='small' onClick={handleSell}>sell</Button>
          )}
        </Grid>
      </Grid>
    ) : (
      <div></div>
    )}
    </div>
  )
}

export default Robot;