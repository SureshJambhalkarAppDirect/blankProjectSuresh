# Pricing & Cart Flow Diagram

This document describes the flow diagrams for the Pricing and Cart system, covering the happy path and timeout scenarios.

## 1. Happy Path Flow

```mermaid
flowchart TD
    A[User adds item to cart] --> B[Pre finalize call successful]
    B --> C[Order Preview call made from Pricing]
    C --> D[AC stores cart details in DB]
    D --> E{Pricing waits for Adobe response}
    E -->|Response received in <20 seconds| F[Adobe returns response]
    F --> G[Prices correctly shown]
    G --> H[No timeout]
    H --> I[Flow completes successfully]
    
    style A fill:#e1f5e1
    style I fill:#e1f5e1
    style F fill:#90EE90
    style H fill:#90EE90
```

## 2. Timeout Flow - With 408 Error Code Support

```mermaid
flowchart TD
    A[User adds item to cart] --> B[Pre finalize call successful]
    B --> C[Order Preview call made from Pricing]
    C --> D{AC checks for existing entry}
    D -->|Found| E[Reuse existing entry]
    D -->|Not Found| F[Create new entry]
    E --> G[AC stores cart details in DB]
    F --> G
    G --> H[Check details from DB]
    H -->|Found in DB| I[Return cached details]
    H -->|Not in DB| J[Send call to Adobe for order preview]
    J --> K{Adobe response timeout}
    K -->|Response in <20s| L[Adobe returns response]
    L --> M[Store response in DB]
    M --> N[Return prices to user]
    K -->|No response in <20s| O[Pricing call gets timed out]
    O --> P[Default prices shown with error message]
    P --> Q[Pricing returns 408 error with message]
    Q --> R[Blocks finalizing the cart]
    R --> S[Checkout and Opportunities save cart with current details]
    S --> T[User refreshes cart]
    T --> U[Go back to row 12 operation]
    U --> V{Adobe eventually responds?}
    V -->|Yes| W[Adobe response stored in DB for same entry]
    V -->|No| X[Cart remains blocked]
    
    style A fill:#e1f5e1
    style O fill:#ffcccc
    style P fill:#ffcccc
    style Q fill:#ffcccc
    style R fill:#ffcccc
```

## 3. Timeout Flow - Without 408 Error Code Support

```mermaid
flowchart TD
    A[User adds item to cart] --> B[Pre finalize call successful]
    B --> C[Order Preview call made from Pricing]
    C --> D{AC checks for existing entry}
    D -->|Found| E[Reuse existing entry]
    D -->|Not Found| F[Create new entry]
    E --> G[AC stores cart details in DB]
    F --> G
    G --> H[Check details from DB]
    H -->|Found in DB| I[Return cached details]
    H -->|Not in DB| J[Send call to Adobe for order preview]
    J --> K{Adobe response timeout}
    K -->|Response in <20s| L[Adobe returns response]
    L --> M[Store response in DB]
    M --> N[Return prices to user]
    K -->|No response in <20s| O[Pricing call gets timed out]
    O --> P[Default prices shown with error message]
    P --> Q{Pricing calls AC to mark as blocked OR AC timer marks timeout}
    Q -->|Option 1| R[Pricing calls AC to mark cart as blocked]
    Q -->|Option 2| S[AC timer marks request timeout based on Pricing and upstream timeout]
    R --> T[AC updates entry in cached response record]
    S --> T
    T --> U[Prevent finalize validation blocks cart submission]
    U --> V[Checkout and Opportunities save cart with current details]
    V --> W[User refreshes cart]
    W --> X[Go back to row 26 operation]
    X --> Y{Adobe eventually responds?}
    Y -->|Yes| Z[Adobe response stored in DB for same entry]
    Y -->|No| AA[Cart remains blocked]
    
    style A fill:#e1f5e1
    style O fill:#ffcccc
    style P fill:#ffcccc
    style T fill:#ffcccc
    style U fill:#ffcccc
```

## 4. Combined Detailed Flow

```mermaid
flowchart TD
    Start[User adds item to cart] --> PreFinalize[Pre finalize call]
    PreFinalize -->|Success| OrderPreview[Order Preview call from Pricing]
    PreFinalize -->|Failure| Error1[Error handling]
    
    OrderPreview --> ACStore[AC stores cart details in DB]
    ACStore --> CheckDB{Check existing entry}
    CheckDB -->|Entry exists| ReuseEntry[Reuse existing entry]
    CheckDB -->|No entry| CreateEntry[Create new entry]
    ReuseEntry --> DBLookup[Check details from DB]
    CreateEntry --> DBLookup
    
    DBLookup -->|Found in DB| ReturnCached[Return cached details]
    DBLookup -->|Not in DB| CallAdobe[Call Adobe for order preview]
    
    ReturnCached --> Success[Success - Prices shown]
    
    CallAdobe --> WaitResponse{Wait for Adobe response}
    WaitResponse -->|Response <20 seconds| AdobeSuccess[Adobe returns response]
    WaitResponse -->|Timeout >=20 seconds| Timeout[Pricing call times out]
    
    AdobeSuccess --> StoreResponse[Store response in DB]
    StoreResponse --> Success
    
    Timeout --> ShowDefault[Show default prices with error message]
    ShowDefault --> ErrorHandling{408 error code support?}
    
    ErrorHandling -->|Yes| Return408[Return 408 error with message]
    ErrorHandling -->|No| MarkBlocked[Pricing calls AC to mark blocked OR AC timer marks timeout]
    
    Return408 --> BlockFinalize1[Block cart finalization]
    MarkBlocked --> UpdateDB[AC updates entry in DB record]
    UpdateDB --> BlockFinalize2[Prevent finalize validation blocks cart]
    
    BlockFinalize1 --> SaveCart1[Checkout/Opportunities save cart]
    BlockFinalize2 --> SaveCart2[Checkout/Opportunities save cart]
    
    SaveCart1 --> Refresh1[User refreshes cart]
    SaveCart2 --> Refresh2[User refreshes cart]
    
    Refresh1 --> CheckDB
    Refresh2 --> CheckDB
    
    style Start fill:#e1f5e1
    style Success fill:#90EE90
    style Timeout fill:#ffcccc
    style ShowDefault fill:#ffcccc
    style BlockFinalize1 fill:#ffcccc
    style BlockFinalize2 fill:#ffcccc
```

## Data Flow - Pricing Request Details

When Pricing sends a request to Adobe Commerce (AC), it should include:

```
Request Payload:
├── Cart ID
├── Customer ID
└── SKUs with number of licenses
    ├── SKU 1: License count
    ├── SKU 2: License count
    └── ...
```

## Key Components

### Adobe Commerce (AC)
- Stores cart details in database
- Checks for existing entries based on Cart ID and items
- Caches Adobe responses
- Can mark requests as blocked/timed out

### Pricing Service
- Makes Order Preview calls to AC
- Handles timeout scenarios
- Returns 408 error code (if supported)
- Shows default prices on timeout
- Blocks cart finalization on timeout

### Adobe Service
- Provides order preview details
- Response time target: <20 seconds
- Response is cached by AC

### Checkout & Opportunities
- Save cart with current details
- Handle 408 errors (if supported)
- Prevent cart finalization when blocked

## Timeout Handling Mechanisms

### With 408 Error Support
1. Pricing returns 408 error code directly
2. Blocks cart finalization immediately
3. Checkout/Opportunities handle 408 error

### Without 408 Error Support
1. Pricing calls AC to mark cart as blocked, OR
2. AC uses timer based on Pricing and upstream timeout values
3. AC updates database entry to mark as blocked
4. Prevent finalize validation blocks cart submission

## Refresh Flow

When user refreshes the cart after timeout:
1. System checks database for cached response
2. If Adobe has responded in the meantime, response is available
3. If still no response, flow returns to timeout handling
4. Process repeats until Adobe responds or user cancels




