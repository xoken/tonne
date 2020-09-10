# nipkow

## Setup on ubuntu machine

**Step 1:**

```
sudo apt install npm
```

---

**Step 2:**

```
git clone --single-branch --branch develop https://github.com/xoken/nipkow.git
```

---

**Step 3:**
cd into the nipkow repo directory and run the following command.

```
npm install
```

when the installation is complete, continue running the following commands inside nipkow repo directory.

```
cd /lib/nipkow-sdk
```

```
npm install
```

---

## To launch nipkow

**Step 1:**
Open a new terminal.
If you are not already in nipkow repo directory, cd into nipkow repo directory and run the following commands.

```
cd /lib/nipkow-sdk
```

```
npm start
```

Keep this terminal window open.

---

**Step 2:**
Open a new terminal.
If you are not already in nipkow repo directory, cd into nipkow repo directory and run the following command.

```
npm start
```

Keep this terminal window open.

---

**Step 3:**
Open a new terminal.
If you are not already in nipkow repo directory, cd into nipkow repo directory and run the following command.

```
npm run electron
```

Keep this terminal window open.

---

## To update nipkow

**Step 1:**
Open a new terminal.
If you are not already in nipkow repo directory, cd into nipkow repo directory and run the following commands.

```
git pull
```

```
npm install
```

```
cd /lib/nipkow-sdk
```

```
npm install
```

To launch updated nipkow, refer to the previous section titled "To launch nipkow".
