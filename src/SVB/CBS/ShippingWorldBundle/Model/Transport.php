<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 24.09.15
 * Time: 16:33
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Transport
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Transport")
 */
class Transport implements TransportInterface, ServiceInterface
{

    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var RouteInterface
     * @OGM\ManyToOne(relation="on_route")
     */
    private $route;

    /**
     * @var ArrayCollection
     * @OGM\ManyToMany(relation="of_book")
     */
    private $books;

    /**
     * @var ShipInterface
     * @OGM\ManyToOne(relation="on_ship")
     */
    private $ship;

    /**
     * @var \DateTime
     * @OGM\Property(format="date")
     */
    private $departureTime;

    /**
     * @var \DateTime
     * @OGM\Property(format="date")
     */
    private $arrivalTime;

    public function __construct(){
        $this->books = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId(){
        return $this->id;
    }

    /**
     * @return RouteInterface
     */
    public function getRoute()
    {
        return $this->route;
    }

    /**
     * @return BookInterface[]
     */
    public function getBooks()
    {
        return $this->books;
    }

    /**
     * @return ShipInterface
     */
    public function getShip()
    {
        return $this->ship;
    }

    /**
     * @return \DateTime|null
     */
    public function getDepartureTime()
    {
        return $this->departureTime;
    }

    /**
     * @return \DateTime|null
     */
    public function getArrivalTime()
    {
        return $this->arrivalTime;
    }

    /**
     * @param $id
     * @return Transport
     */
    public function setId($id){
        $this->id = $id;
        return $this;
    }

    /**
     * @param RouteInterface $route
     * @return Transport
     */
    public function setRoute($route)
    {
        $this->route = $route;
        return $this;
    }

    /**
     * @param ArrayCollection $books
     * @return Transport
     */
    public function setBooks($books)
    {
        $this->books = $books;
        return $this;
    }

    /**
     * @param ShipInterface $ship
     * @return Transport
     */
    public function setShip($ship)
    {
        $this->ship = $ship;
        return $this;
    }

    /**
     * @param \DateTime $departureTime
     * @return Transport
     */
    public function setDepartureTime($departureTime)
    {
        $this->departureTime = $departureTime;
        return $this;
    }

    /**
     * @param \DateTime $arrivalTime
     * @return Transport
     */
    public function setArrivalTime($arrivalTime)
    {
        $this->arrivalTime = $arrivalTime;
        return $this;
    }

    /**
     * @return Transport
     */
    public static function create(){
        return new Transport();
    }



}