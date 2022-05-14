# backend

## TODO
Document how to setup the project

## Branches

### dev branch
The `dev` branch is reserved for the development deployment, this is where we and our client can view changes after they are made. It is linked to pipeline that deploys the changes over the internet after every merge.
This branch is protected and only maintainers can merge and push to it.

### main branch
The `main` branch is the default branch, it is used for the production deployment. All commits must go through the `dev` bracnh before making it to the `main` branch.
This branch is also part of a pipeline that deploys the changed after commits are made.

## Git Flow
Before starting on any feature or fix, the first step is to clone the `dev` branch. The `dev` branch is the starting point for all new features (in case your latest changes have not yet been integrated in the `dev` branch it might be okay, as an exception, to build on top of your existing branch).
After you push your changes to your new branch, you should open a merge request and assign a reviewer to it. A reviewer's job then is to review and approve your changes.


