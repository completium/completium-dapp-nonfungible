import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useAccountPkh, useReady, useTezos } from '../dapp';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Button from '@material-ui/core/Button';
import { useNonFungibleStateContext } from '../NonFungibleState.js';
import Badge from '@material-ui/core/Badge';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { robotributes } from '../robots.js';
import Divider from '@material-ui/core/Divider';
import { contractAddress } from '../settings';

const BasketItem = (props) => {
  const { nonFungibleState, setBasket } = useNonFungibleStateContext();
  const handleClick = () => {
    console.log(`basket: ${nonFungibleState.basket.filter(r => r !== props.data.id)}`);
    setBasket(nonFungibleState.basket.filter(r => r !== props.data.id));
  }
  return (
    <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3}>
      <Grid item style={{ textAlign: 'center', marginTop: 10 }}>
        <img src={process.env.PUBLIC_URL + "/images/streamline-icon-" + props.data.name + "@200x200.svg"} style={{ width: '50px' }}></img>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='caption' style={{
          fontFamily: 'Orbitron',
        }}> #{ props.data.id } </Typography>
      </Grid>
      <Grid item xs={2}> {props.data.price}ꜩ </Grid>
      <Grid item style={{ marginLeft: 30 }}>
        <Button
          disableElevation
          variant='outlined'
          color='secondary'
          size='small'
          onClick={handleClick}
        >
          remove
        </Button>
      </Grid>
    </Grid>
  )
}

function getTotal(robots, basket) {
  var total = 0;
  robots.filter(r => basket.includes(r.id)).forEach(element => {
    total += element.price;
  });
  return total;
}

const Account = (props) => {
  const account = useAccountPkh();
  const ready = useReady();
  const { nonFungibleState, setNonFungibleState, setNotReady } = useNonFungibleStateContext();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const tezos = useTezos();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleBuy = () => {
    tezos.wallet.at(contractAddress).then(contract => {
      var amount = getTotal(robotributes, nonFungibleState.basket).toFixed(1);
      contract.methods.buy(nonFungibleState.basket).send({ amount: amount, mutez: false }).then(op => {
        props.openSnack();
        op.receipt().then(() => {
          props.closeSnack();
          setNotReady();
        })
      })
    });
    setOpen(false);
  }
  var basketItems = robotributes.filter(r => nonFungibleState.basket.includes(r.id)).map(r => {
      console.log(`basket element: ${r.id}`);
      return (
        <BasketItem data={r} />
      )
  });
  return (
    <Grid container direction="row" justify="flex-end" alignItems="center" spacing={6}>
      <Grid item>
      <Typography>account:</Typography>
        {
        (ready)? (
          <Typography variant='caption' style={{
            fontFamily: 'Orbitron'
            }}>
            {account}
          </Typography>
        ):(
          <Typography color='textSecondary' variant='caption' style={{
            fontFamily: 'Orbitron'
            }}>
            (connect to wallet)
          </Typography>
        )
      }
      </Grid>
      <Grid item>
      <Badge badgeContent={nonFungibleState.basket.length} color="error">
        <Button
          ref={anchorRef}
          startIcon={<ShoppingBasketIcon />}
          disableElevation color='secondary'
          disabled={nonFungibleState.basket.length === 0}
          onClick={handleToggle}
        >
          Basket
        </Button>
        <Popper open={open && nonFungibleState.basket.length !== 0} anchorEl={anchorRef.current} role={undefined} transition disablePortal style={{ zIndex: 100 }}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'left top' : 'right bottom',
              }}
            >
              <Paper elevation={3} square style={{ width: 400, padding: 24, paddingTop: 8 }}>
                  <MenuList id="split-button-menu">
                    {
                      basketItems
                    }
                    <Divider />
                    <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3} style={{ marginTop: 15 }}>
                      <Grid item xs={5}>
                        <Typography>Total</Typography>
                      </Grid>
                      <Grid item style={{ marginLeft: 10 }}>
                        <Typography variant='h6'>{ getTotal(robotributes, nonFungibleState.basket).toFixed(1) }ꜩ</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant='contained' disableElevation color='secondary' onClick={handleBuy}>
                          buy
                        </Button>
                      </Grid>
                    </Grid>
                  </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
        </Badge>
      </Grid>
    </Grid>
  )
}

export default Account;