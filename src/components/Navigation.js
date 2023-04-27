import {
    Box,
    Flex,
    Avatar,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    PopoverHeader,
    PopoverCloseButton
  } from '@chakra-ui/react';
  import { MoonIcon, SunIcon } from '@chakra-ui/icons';
  
  import { useMetaMask } from "metamask-react";
  import { IconCus } from './dist/icon';
  
  
  export default function Nav() {
     
      const { status, connect, account, chainId, ethereum } = useMetaMask();
  
      function Metamask() {
        
          if(status === "notConnected") return (
              <Button variant='outline'  fontSize={15} onClick={connect} leftIcon={<IconCus />}>
              Connect
              </Button>
            
          )        
    
          if (status === "connecting") return <div>Connecting...</div>
      
          if (status === "connected") return (
              <Popover>
    <PopoverTrigger>
      <Button variant='outline' fontSize={15} leftIcon={<IconCus />}>
          Connected</Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>Connected</PopoverHeader>
      <PopoverBody>To Account {account}</PopoverBody>
    </PopoverContent>
  </Popover>
          )
          return null
      } 
  
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <>
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Box>Logo</Box>
          
  
            <Flex alignItems={'center'}>
              <Stack direction={'row'} spacing={7}>
                <Button onClick={toggleColorMode}>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>
                
          <Metamask />
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={'https://raw.githubusercontent.com/MetaMask/brand-resources/c3c894bb8c460a2e9f47c07f6ef32e234190a7aa/SVG/metamask-fox.svg'}
                    />
                    
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </>
    );
  }