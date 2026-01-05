// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title UniswapSwapRouter
 * @notice Routes token swaps through Uniswap V3 on Base Mainnet
 * @dev No liquidity required - uses existing Uniswap V3 pools
 */

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint256) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract UniswapSwapRouter {
    // BASE MAINNET ADDRESSES
    address public constant UNISWAP_V3_ROUTER = 0x2626664c2603336E57B271c5C0b26F421741e481;
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    uint24 public constant FEE_LOW = 500;
    uint24 public constant FEE_MEDIUM = 3000;
    uint24 public constant FEE_HIGH = 10000;
    uint24 public constant DEFAULT_FEE = 500; // 0.05% - most liquid for WETH/USDC on Base
    
    event SwapExecuted(
        address indexed user,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 timestamp
    );
    
    event ETHReceived(address indexed sender, uint256 amount);
    
    function swapWETHForUSDC(uint256 amountIn, uint256 amountOutMinimum) 
        external 
        returns (uint256 amountOut) 
    {
        require(amountIn > 0, "Amount must be > 0");
        
        bool success = IERC20(WETH).transferFrom(msg.sender, address(this), amountIn);
        require(success, "WETH transfer failed");
        
        IERC20(WETH).approve(UNISWAP_V3_ROUTER, amountIn);
        
        // Try 0.05% fee tier first (most liquid for WETH/USDC on Base)
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: FEE_LOW, // 500 = 0.05%
                recipient: msg.sender,
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });
        
        try ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(params) returns (uint256 result) {
            amountOut = result;
        } catch {
            // Fallback to 0.3% fee tier
            params.fee = FEE_MEDIUM;
            amountOut = ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(params);
        }
        
        emit SwapExecuted(msg.sender, WETH, USDC, amountIn, amountOut, block.timestamp);
        return amountOut;
    }
    
    function swapUSDCForWETH(uint256 amountIn, uint256 amountOutMinimum) 
        external 
        returns (uint256 amountOut) 
    {
        require(amountIn > 0, "Amount must be > 0");
        
        bool success = IERC20(USDC).transferFrom(msg.sender, address(this), amountIn);
        require(success, "USDC transfer failed");
        
        IERC20(USDC).approve(UNISWAP_V3_ROUTER, amountIn);
        
        // Try 0.05% fee tier first (most liquid for WETH/USDC on Base)
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: USDC,
                tokenOut: WETH,
                fee: FEE_LOW, // 500 = 0.05%
                recipient: msg.sender,
                deadline: block.timestamp + 300,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });
        
        try ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(params) returns (uint256 result) {
            amountOut = result;
        } catch {
            // Fallback to 0.3% fee tier
            params.fee = FEE_MEDIUM;
            amountOut = ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(params);
        }
        
        emit SwapExecuted(msg.sender, USDC, WETH, amountIn, amountOut, block.timestamp);
        return amountOut;
    }
    
    function swapETHForUSDC(uint256 amountOutMinimum) 
        external 
        payable 
        returns (uint256 amountOut) 
    {
        require(msg.value > 0, "Must send ETH");
        
        IWETH(WETH).deposit{value: msg.value}();
        IWETH(WETH).approve(UNISWAP_V3_ROUTER, msg.value);
        
        // Try 0.05% fee tier first (most liquid for WETH/USDC on Base)
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: USDC,
                fee: FEE_LOW, // 500 = 0.05% - most liquid on Base
                recipient: msg.sender,
                deadline: block.timestamp + 300,
                amountIn: msg.value,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });
        
        try ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(params) returns (uint256 result) {
            amountOut = result;
        } catch {
            // Fallback to 0.3% fee tier
            params.fee = FEE_MEDIUM;
            amountOut = ISwapRouter(UNISWAP_V3_ROUTER).exactInputSingle(params);
        }
        
        emit SwapExecuted(msg.sender, WETH, USDC, msg.value, amountOut, block.timestamp);
        return amountOut;
    }
    
    function recoverERC20(address token, uint256 amount, address to) external {
        require(to != address(0), "Invalid recipient");
        IERC20(token).transfer(to, amount);
    }
    
    function recoverETH(address payable to) external {
        require(to != address(0), "Invalid recipient");
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to recover");
        to.transfer(balance);
    }
    
    receive() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }
    
    fallback() external payable {
        emit ETHReceived(msg.sender, msg.value);
    }
}
